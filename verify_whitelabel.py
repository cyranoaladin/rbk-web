from __future__ import annotations

import pathlib
import re
import sys


BLACKLIST = [
    "RBK",
    "RebootKamp",
    "Nexus",
    "Nexus Réussite",
    "Money Factory AI",
    "MFAI",
    "Prix",
    "Tarif",
    "15 000",
    "TND",
    "ISA",
    "Income Share Agreement",
]

RED = "\033[31m"
GREEN = "\033[32m"
RESET = "\033[0m"


def scan_file(path: pathlib.Path) -> list[str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    matches = []
    for word in BLACKLIST:
        pattern = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
        if pattern.search(text):
            matches.append(word)
    return matches


def main() -> int:
    base = pathlib.Path(__file__).parent
    targets = sorted(base.glob("chapters/tech_*.html"))
    targets.append(base / "formation_web3_tunisie.html")

    has_issue = False
    for path in targets:
        hits = scan_file(path)
        if hits:
            has_issue = True
            unique_hits = sorted(set(hits))
            hits_str = ", ".join(f"«{h}»" for h in unique_hits)
            print(f"{RED}ERREUR{RESET} {path}: mot interdit détecté ({hits_str})")

    if has_issue:
        return 1

    print(f"{GREEN}SUCCÈS{RESET} : aucun mot interdit détecté dans {len(targets)} fichiers.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
