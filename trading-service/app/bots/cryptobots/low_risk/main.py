"""Entry: `python main.py` with PYTHONPATH=cryptobots, or `python -m low_risk.cli.main`."""

import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from low_risk.cli.main import main

if __name__ == "__main__":
    main()
