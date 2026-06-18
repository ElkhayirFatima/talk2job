from app.modules.cv.infrastructure.parsers import pdf_parser, word_parser, latex_parser


class DocumentFactory:
    @staticmethod
    def get_text(file_path: str, extension: str) -> str:
        if extension == ".pdf":
            return pdf_parser.extract(file_path)
        elif extension in [".docx", ".doc"]:
            return word_parser.extract(file_path)
        elif extension in [".tex"]:
            return latex_parser.extract(file_path)
        else:
            raise ValueError(
                f"Extension {extension} non supportée par le service Tech."
            )
