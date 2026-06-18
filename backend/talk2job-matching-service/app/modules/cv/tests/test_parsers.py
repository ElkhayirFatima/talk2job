import pytest
from app.modules.cv.infrastructure.parsers.document_factory import DocumentFactory
import os


def test_pdf_parsing():
    text = DocumentFactory.get_text("tests/samples/test_pdf.pdf", ".pdf")
    assert len(text) > 0
    # On passe tout en minuscule pour ne pas s'embêter avec les majuscules/accents
    assert "afnane" in text.lower()
    assert "informatique" in text.lower()


def test_docx_hybrid_parsing():
    text = DocumentFactory.get_text("tests/samples/test_docx.docx", ".docx")
    assert isinstance(text, str)
    assert len(text) > 0


def test_latex_parsing():
    path = "tests/samples/test_latex.tex"

    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(r"""
            \documentclass{article}
            \begin{document}
            \section{Skills}
            Python, React, PostgreSQL.
            \end{document}
            """)

    text = DocumentFactory.get_text(path, ".tex")
    # On cherche "skills" en minuscule pour accepter "Skills", "SKILLS" ou "§ SKILLS"
    assert "skills" in text.lower()
    assert "python" in text.lower()
