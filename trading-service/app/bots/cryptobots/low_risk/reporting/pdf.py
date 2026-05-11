"""PDF report (unchanged layout)."""
from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from fpdf import FPDF

from low_risk.config import PAIRS
from low_risk.strategy.strategy import Trade


class ReportPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 14)
        self.cell(0, 8, "Low Risk Crypto Bot Backtest Report", align="C")
        self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")


def generate_pdf(
    trades: List[Trade],
    pair_profits: Dict[str, float],
    start_date: str,
    end_date: str,
    initial_wallet: float,
    final_wallet: float,
    output_file: str | Path,
):
    out = Path(output_file)
    out.parent.mkdir(parents=True, exist_ok=True)
    output_file = str(out)

    total_trades = len(trades)
    wins = sum(1 for t in trades if t.pnl > 0)
    losses = sum(1 for t in trades if t.pnl < 0)
    total_profit = final_wallet - initial_wallet

    pdf = ReportPDF(orientation="L", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=12)
    pdf.add_page()
    pdf.set_font("Helvetica", size=11)

    pdf.cell(0, 8, f"Backtesting period: {start_date} to {end_date}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Starting wallet: ${initial_wallet:,.2f}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Final wallet: ${final_wallet:,.2f}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Total profit/loss: ${total_profit:,.2f}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Total trades: {total_trades}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Profitable trades: {wins}")
    pdf.ln(8)
    pdf.cell(0, 8, f"Loss trades: {losses}")
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 8, "Profit summary by pair (BTC -> ETH -> BNB -> SOL):")
    pdf.ln(8)
    pdf.set_font("Helvetica", size=11)
    for pair in PAIRS:
        pdf.cell(0, 7, f"{pair}: ${pair_profits.get(pair, 0.0):,.2f}")
        pdf.ln(7)

    pdf.ln(4)
    pdf.set_font("Helvetica", "B", 10)
    headers = [
        "Pair",
        "Side",
        "Entry Date/Time",
        "Exit Date/Time",
        "Entry Price",
        "Exit Price",
        "Units",
        "PnL ($)",
        "Return (%)",
        "Wallet After",
    ]
    col_widths = [22, 18, 36, 36, 28, 28, 22, 24, 22, 30]

    for h, w in zip(headers, col_widths):
        pdf.cell(w, 8, h, border=1, align="C")
    pdf.ln()

    pdf.set_font("Helvetica", size=9)
    for t in trades:
        row = [
            t.pair,
            t.side,
            t.entry_datetime.strftime("%Y-%m-%d %H:%M"),
            t.exit_datetime.strftime("%Y-%m-%d %H:%M"),
            f"{t.entry_price:.2f}",
            f"{t.exit_price:.2f}",
            f"{t.units:.5f}",
            f"{t.pnl:.2f}",
            f"{t.return_pct:.2f}",
            f"{t.wallet_after:.2f}",
        ]
        for val, w in zip(row, col_widths):
            pdf.cell(w, 7, str(val), border=1, align="C")
        pdf.ln()

    pdf.output(output_file)
