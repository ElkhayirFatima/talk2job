from pylatexenc.latex2text import LatexNodes2Text


def extract(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            latex_code = f.read()

        # Tentative avec la lib
        try:
            text = LatexNodes2Text().latex_to_text(latex_code)
        except:
            # Fallback : si la lib crash, on lit le texte brut
            text = latex_code

        return text.strip()
    except Exception as e:
        return f"Erreur LaTeX : {str(e)}"
