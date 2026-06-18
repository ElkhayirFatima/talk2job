SKILL_MAPPING = {
    # Cloud & Infrastructure
    "aws": "amazon web services",
    "gcp": "google cloud platform",
    "google cloud": "google cloud platform",
    "azure": "microsoft azure",
    "proxmox": "proxmox ve",
    # Containers & Orchestration
    "k8s": "kubernetes",
    "docker": "docker",
    "jenkins": "jenkins",
    "terraform": "terraform",
    "ansible": "ansible",
    # CI/CD & Version Control
    "ci/cd": "ci-cd",
    "cicd": "ci-cd",
    "ci / cd": "ci-cd",
    "gitlab": "gitlab",
    "github": "github",
    "sonarcloud": "sonarcloud",
    "sonarqube": "sonarqube",
    # Languages & Frameworks
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "cpp": "c++",
    "csharp": "c#",
    "golang": "go",
    "reactjs": "react",
    "react.js": "react",
    "vuejs": "vue",
    "vue.js": "vue",
    "nextjs": "next",
    "next.js": "next",
    "nodejs": "node",
    "node.js": "node",
    "angular": "angular",
    "angularjs": "angular",
    "springboot": "spring boot",
    "spring": "spring boot",
    "asp.net": "asp.net",
    "dotnet": "asp.net",
    "aspnet": "asp.net",
    "asp.net core": "asp.net core",
    "dotnet core": "asp.net core",
    "aspnet core": "asp.net core",
    "jee": "java enterprise edition",
    # Databases
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "mongo": "mongodb",
    "mongodb": "mongodb",
    "sql": "sql",
    "firebase": "firebase",
    "mysql": "mysql",
    "redis": "redis",
    "sql server": "microsoft sql server",
    "db2": "ibm db2",
    "oracle": "oracle database",
    "cassandra": "apache cassandra",
    "elasticsearch": "elasticsearch",
    # Tools & Project Management
    "android studio": "android studio",
    "netbeans": "apache netbeans",
    "apache netbeans": "apache netbeans",
    "uml": "unified modeling language",
    "jira": "jira",
    "scrum": "scrum",
    "kanban": "kanban",
    # Data Science & AI
    "ml": "machine learning",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "llm": "large language models",
    "cv": "computer vision",
    "ai": "artificial intelligence",
    "tf": "tensorflow",
    "tensorflow": "tensorflow",
    "pytorch": "pytorch",
    "sklearn": "scikit-learn",
    "pandas": "pandas",
    "numpy": "numpy",
    "spark": "apache spark",
}


def normalize_skill(skill: str) -> str:
    """Nettoie et normalise une compétence unique."""
    if not skill:
        return ""

    # 1. Lowercase + Strip (Removing leading/trailing spaces)
    clean_name = skill.lower().strip()

    # 2. Return mapped value if exists, else return cleaned name

    return SKILL_MAPPING.get(clean_name, clean_name)


def normalize_skill_list(skills: list) -> list:
    """Prend une liste et retourne une liste normalisée sans doublons."""
    normalized_set = {normalize_skill(s) for s in skills if s}
    return list(normalized_set)
