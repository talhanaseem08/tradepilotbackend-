"""Binance testnet balance note.

Binance does not allow crediting balances via API. Use the Binance testnet
faucet / web UI to top up your testnet account, then re-run trades.
"""

def main():
    print(
        "Cannot add balance via API on Binance testnet.\n"
        "Use the Binance testnet faucet / wallet page to credit funds,\n"
        "then place trades with: python -m medium_risk.trading.sampletrade"
    )


if __name__ == "__main__":
    main()

