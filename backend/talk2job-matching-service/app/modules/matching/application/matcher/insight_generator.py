import random


class MatchInsightGenerator:
    @staticmethod
    def get_insight(
        name, user_level, job_level, job_title, score, top_skill="your core stack"
    ):
        ranks = {"Junior": 1, "Mid-level": 2, "Senior": 3}
        u_rank = ranks.get(user_level, 1)
        j_rank = ranks.get(job_level, 1)
        gap = j_rank - u_rank

        # --- 1. LOW MATCH (< 50%) ---
        if score < 50:
            status = "Low Match"
            options = [
                f"Hello {name}, our analysis indicates a significant gap (Score: {score}%) between your current profile and this {job_title} role. We suggest focusing on positions that better leverage your expertise in {top_skill}.",
                f"Technically, {name}, this role requires a different focus. With a {score}% alignment, it might be challenging to meet the core expectations. Don't hesitate to explore roles more aligned with your background.",
                f"A tough match, {name}. The technical requirements for this {job_level} position don't quite sync with your current stack yet. Use this as a guide for what skills to sharpen next.",
                f"Strategic advice, {name}: your compatibility score of {score}% suggests that this role might not be the best fit for your current trajectory. We recommend roles that prioritize {top_skill}.",
                f"Not the ideal match yet, {name}. The gap in technical requirements is quite wide for this {job_title} position. Look for opportunities that better celebrate your existing skill set.",
                f"Professional insight: This {job_level} role heavily relies on tools outside your primary stack (Score: {score}%). Our AI recommends targeting roles where your {top_skill} mastery can shine.",
            ]

        # --- 2. CHALLENGING (User < Job & Score >= 50%) ---
        elif gap > 0:
            status = "Challenging"
            if score >= 70:
                options = [
                    f"Impressive work, {name}! Your {score}% technical score proves you're ready for a {job_level} challenge. This is your chance to show that seniority is just a label.",
                    f"Ready to level up, {name}? Your strong technical alignment ({score}%) suggests you can bridge the gap to this {job_level} role. Let's prove you can play in the big leagues.",
                    f"Career leap detected! Your profile is technically robust enough (Score: {score}%) to compete for this {job_level} position. Use this simulation to sharpen your senior-level communication.",
                    f"Don't let the {job_level} title hold you back, {name}. With a {score}% match, you have the foundational power to exceed expectations. Show them your rapid learning curve!",
                    f"High-potential match! You're technically over-performing for a {user_level} (Match: {score}%). This {job_level} role is the perfect stage to showcase your readiness for promotion.",
                    f"Breaking barriers, {name}! Your compatibility with this {job_level} role is exceptionally high at {score}%. Prepare to demonstrate how your {user_level} agility complements senior-level needs.",
                ]
            else:
                options = [
                    f"A steep climb, but possible, {name}. As a {user_level} eyeing a {job_level} role with a {score}% score, focus on demonstrating high adaptability and architectural logic.",
                    f"High growth potential detected! This {job_level} role is a reach, but your {score}% match shows a solid foundation. Focus on showing your potential during this session.",
                    f"Ambition meets reality, {name}. Transitioning to a {job_level} role requires more than just skills—use your {score}% match to pivot the conversation toward your problem-solving abilities.",
                    f"The gap is there, but so is the opportunity. At {score}%, you'll need to work hard to prove your {user_level} experience translates to {job_level} responsibilities.",
                    f"A challenging bridge to cross, {name}. Your technical score of {score}% is a good start for this {job_level} role. Focus on high-level system design in this interview.",
                    f"Level-up mode activated! You're currently a {user_level} targeting a {job_level} opening. With {score}% alignment, this session is critical to proving your technical maturity.",
                ]

        # --- 3. IDEAL MATCH (User == Job & Score >= 50%) ---
        elif gap == 0:
            status = "Ideal Match"
            if score >= 75:
                options = [
                    f"Spot on, {name}! A {score}% match for a {job_level} role is excellent. You are perfectly positioned for this role—let's refine your delivery to ensure success.",
                    f"Ideal alignment found, {name}. Your current seniority and technical skills (Score: {score}%) are in total sync. You should feel confident going into this interview.",
                    f"Total synergy! Your profile and this {job_title} role are a match made in heaven (Match: {score}%). This session will help you move from 'qualified' to 'top-choice'.",
                    f"Recruiter's dream match, {name}! At {score}%, you meet almost every requirement for this {job_level} role. Let's focus on cultural fit and advanced technical nuances.",
                    f"You're the benchmark candidate! With a {score}% score, you are exactly who they are looking for. Use this simulation to finalize your 'closing' arguments for the job.",
                    f"Precision match detected. Your {user_level} expertise in {top_skill} is exactly what this {job_level} role demands (Score: {score}%). Let's nail the technical deep-dive!",
                ]
            else:
                options = [
                    f"Good alignment, {name}. You have a solid {score}% match for this {job_level} role. While you meet most criteria, use this to sharpen the remaining {100-score}% of requirements.",
                    f"You're in the right place, {name}. As a {user_level}, you meet the primary needs of this role. Let's work on polishing your answers to stand out.",
                    f"Strong baseline, {name}. Your {score}% score puts you in a good position for this {job_level} role. Let's focus on the specific {top_skill} requirements you might have missed.",
                    f"Reliable match! You're well-suited for this {job_level} opening (Score: {score}%). Our AI recommends focusing on the nuances of {job_title} to boost your chances.",
                    f"Compatible and ready! At {score}%, you are a strong contender for this {job_level} role. This interview prep will help you bridge the small gaps in your tech stack.",
                    f"Solid technical footing, {name}. Your {user_level} background covers {score}% of this role's needs. Use this session to demonstrate your mastery of the core tools.",
                ]

        # --- 4. OVERQUALIFIED (User > Job & Score >= 50%) ---
        else:
            status = "Overqualified"
            options = [
                f"You have the upper hand, {name}. As a {user_level}, your expertise exceeds these {job_level} requirements (Match: {score}%). Focus on demonstrating leadership.",
                f"Strategic Advantage! Your background puts you way ahead for this {job_title} role. Use this to showcase how a pro handles core tasks with efficiency.",
                f"Seniority bonus! Your {user_level} experience makes you a heavyweight for this {job_level} position (Score: {score}%). Focus on how you can add architectural value.",
                f"You're a high-value asset for this role, {name}. At {score}%, the technical side should be easy—focus on showcasing your mentorship and process optimization skills.",
                f"Dominant technical match! As a {user_level}, you bring far more to the table than this {job_level} role asks for. Use this to negotiate from a position of power.",
                f"Expert-level alignment! With a {score}% score, you exceed the {job_level} threshold. Show them how your {user_level} vision can elevate their entire {job_title} workflow.",
            ]

        return {"status": status, "message": random.choice(options)}
