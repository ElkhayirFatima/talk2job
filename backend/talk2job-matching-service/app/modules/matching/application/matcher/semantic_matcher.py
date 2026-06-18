from sentence_transformers import util
import torch


class SemanticMatcher:
    def calculate_similarity(self, vector_a, vector_b):
        """
        Calculates cosine similarity between two vectors (Summary or Skills).
        """
        if vector_a is None or vector_b is None:
            return 0.0

        # Ensure vectors are tensors
        if isinstance(vector_a, list):
            vector_a = torch.tensor(vector_a)
        if isinstance(vector_b, list):
            vector_b = torch.tensor(vector_b)

        score = util.cos_sim(vector_a, vector_b).item()
        return round(score, 4)

    def apply_seniority_adjustment(self, base_score, user_level, job_level):
        """
        Applies a penalty if the candidate is under-qualified (Seniority gap).
        """
        ranks = {"Junior": 1, "Mid-level": 2, "Senior": 3}
        u_rank = ranks.get(user_level, 1)
        j_rank = ranks.get(job_level, 1)

        diff = j_rank - u_rank
        penalty = 1.0

        if diff == 1:  # Junior -> Mid or Mid -> Senior
            penalty = 0.90  # 10% penalty
        elif diff >= 2:  # Junior -> Senior
            penalty = 0.75  # 25% penalty

        return round(base_score * penalty, 2)
