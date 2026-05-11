"""ReportLab PDF (unchanged from original high-risk bot)."""
from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from high_risk.strategy.strategy import Trade


def as_trade_frame(trades: List[Trade]) -> pd.DataFrame:
    rows = [
        {
            "Pair": t.pair,
            "Side": t.side,
            "Entry DateTime": t.entry_time.strftime("%Y-%m-%d %H:%M:%S"),
            "Exit DateTime": t.exit_time.strftime("%Y-%m-%d %H:%M:%S"),
            "Entry Price": round(t.entry_price, 4),
            "Exit Price": round(t.exit_price, 4),
            "Stop Price": round(t.stop_price, 4),
            "Target Price": round(t.target_price, 4),
            "Qty": round(t.quantity, 6),
            "PnL USD": round(t.pnl_usd, 2),
            "Return %": round(t.return_pct, 3),
            "Result": t.result,
            "Close Reason": t.reason,
        }
        for t in trades
    ]
    return pd.DataFrame(rows)


def pair_summary(trade_df: pd.DataFrame) -> pd.DataFrame:
    order = ["BTC", "ETH", "BNB", "SOL"]
    out = []
    for pair in order:
        sub = trade_df[trade_df["Pair"] == pair]
        out.append(
            {
                "Pair": pair,
                "Trades": int(len(sub)),
                "Profit Trades": int((sub["PnL USD"] > 0).sum()),
                "Loss Trades": int((sub["PnL USD"] <= 0).sum()),
                "Total PnL USD": round(float(sub["PnL USD"].sum()), 2),
            }
        )
    return pd.DataFrame(out)


def performance_windows(trade_df: pd.DataFrame, end_date: str, initial_wallet: float) -> pd.DataFrame:
    windows: List[Tuple[str, int]] = [
        ("Previous Month", 30),
        ("Past 6 Months", 182),
        ("Past 1 Year", 365),
    ]
    if trade_df.empty:
        return pd.DataFrame(
            [
                {
                    "Window": label,
                    "Trades": 0,
                    "Profit Trades": 0,
                    "Loss Trades": 0,
                    "PnL USD": 0.0,
                    "Return %": 0.0,
                    "Profit %": 0.0,
                }
                for label, _ in windows
            ]
        )

    tmp = trade_df.copy()
    tmp["Exit DateTime"] = pd.to_datetime(tmp["Exit DateTime"])
    end_dt = pd.to_datetime(end_date)

    rows = []
    for label, days in windows:
        start_dt = end_dt - pd.Timedelta(days=days)
        w = tmp[(tmp["Exit DateTime"] >= start_dt) & (tmp["Exit DateTime"] <= end_dt)]
        trades = int(len(w))
        profit_trades = int((w["PnL USD"] > 0).sum())
        loss_trades = int((w["PnL USD"] <= 0).sum())
        pnl = float(w["PnL USD"].sum()) if trades > 0 else 0.0
        ret_pct = (pnl / initial_wallet) * 100 if initial_wallet > 0 else 0.0
        profit_pct = (profit_trades / trades) * 100 if trades > 0 else 0.0
        rows.append(
            {
                "Window": label,
                "Trades": trades,
                "Profit Trades": profit_trades,
                "Loss Trades": loss_trades,
                "PnL USD": round(pnl, 2),
                "Return %": round(ret_pct, 3),
                "Profit %": round(profit_pct, 2),
            }
        )
    return pd.DataFrame(rows)


def build_pdf_report(
    output_path: str | Path,
    trade_df: pd.DataFrame,
    summary_df: pd.DataFrame,
    window_perf_df: pd.DataFrame,
    start_date: str,
    end_date: str,
    initial_wallet: float,
    risk_per_trade: float,
):
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    output_path = str(out)

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    elements = []

    final_wallet = initial_wallet + float(trade_df["PnL USD"].sum()) if not trade_df.empty else initial_wallet
    total_trades = int(len(trade_df))
    win_trades = int((trade_df["PnL USD"] > 0).sum()) if not trade_df.empty else 0
    loss_trades = int((trade_df["PnL USD"] <= 0).sum()) if not trade_df.empty else 0

    elements.append(Paragraph("Crypto Bot Backtesting Report", styles["Title"]))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(f"Backtest Start Date: {start_date}", styles["Normal"]))
    elements.append(Paragraph(f"Backtest End Date: {end_date}", styles["Normal"]))
    elements.append(Paragraph(f"Initial Wallet: ${initial_wallet:,.2f}", styles["Normal"]))
    elements.append(Paragraph(f"Risk Per Trade: ${risk_per_trade:,.2f}", styles["Normal"]))
    elements.append(Paragraph(f"Final Wallet: ${final_wallet:,.2f}", styles["Normal"]))
    elements.append(Paragraph(f"Total Trades: {total_trades}", styles["Normal"]))
    elements.append(Paragraph(f"Profitable Trades: {win_trades}", styles["Normal"]))
    elements.append(Paragraph(f"Loss Trades: {loss_trades}", styles["Normal"]))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("PnL Summary (BTC -> ETH -> BNB -> SOL)", styles["Heading2"]))
    summary_data = [summary_df.columns.tolist()] + summary_df.values.tolist()
    summary_table = Table(summary_data, repeatRows=1)
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2e3b4e")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ]
        )
    )
    elements.append(summary_table)
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("Time-Window Performance", styles["Heading2"]))
    window_data = [window_perf_df.columns.tolist()] + window_perf_df.values.tolist()
    window_table = Table(window_data, repeatRows=1)
    window_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#374151")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ]
        )
    )
    elements.append(window_table)
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("Trade-by-Trade Details", styles["Heading2"]))
    if trade_df.empty:
        elements.append(Paragraph("No trades were generated for the selected period.", styles["Normal"]))
    else:
        display_cols = [
            "Pair",
            "Side",
            "Entry DateTime",
            "Exit DateTime",
            "Entry Price",
            "Exit Price",
            "Return %",
            "PnL USD",
            "Result",
        ]
        detail_data = [display_cols] + trade_df[display_cols].values.tolist()
        detail_table = Table(detail_data, repeatRows=1)
        detail_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f4e78")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTSIZE", (0, 0), (-1, -1), 7),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ]
            )
        )
        elements.append(detail_table)

    doc.build(elements)
