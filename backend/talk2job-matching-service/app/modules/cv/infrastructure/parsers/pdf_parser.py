import fitz
import re


def extract(file_path: str) -> str:
    try:
        doc = fitz.open(file_path)
        full_text = []

        for page in doc:
            # "dict" permet de récupérer plus d'infos si "blocks" échoue
            blocks = page.get_text("blocks")

            # On trie simplement par position verticale (y1)
            blocks.sort(key=lambda b: b[1])

            for b in blocks:
                # b[4] est le texte du bloc
                if b[4].strip():
                    # Nettoyage des espaces de ligatures
                    clean = re.sub(r"(?<=\b\w)\s(?=\w\b)", "", b[4])
                    full_text.append(clean.strip())

        doc.close()
        result = "\n".join(full_text)
        return result if result.strip() else "Aucun texte n'a pu être extrait du PDF."

    except Exception as e:
        return f"Erreur PDF : {str(e)}"
