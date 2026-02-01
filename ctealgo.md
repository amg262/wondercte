Here is the technical specification for the **Adaptive Cognitive Efficiency (ACE)** algorithm. This document is formatted for implementation by a development team or data scientist.

### Algorithm Name: ACE-v1 (Adaptive Cognitive Efficiency)

**Core Philosophy:** This algorithm distinguishes between "Processing Power" (Difficulty) and "Processing Efficiency" (Time/Stability). Unlike standard tests, **Accuracy is a binary gate, not the score itself.** You only accrue points if you are accurate; the *amount* of points is determined by how efficiently you arrived at the truth.

---

### 1. The Scoring Function (Per Question)

The score for any single question () is calculated using a **Time-Decayed Exponential Model**. This prevents the "infinity score" glitch while aggressively rewarding speed.

#### Variable Definitions:

| Variable | Name | Type | Definition |
| --- | --- | --- | --- |
| **** | Accuracy Vector | Binary  | **0** if incorrect/skipped, **1** if correct. |
| **** | Difficulty | Integer  | The complexity rating of the specific question. |
| **** | Actual Time | Float (ms) | Time elapsed from question render to final submission. |
| **** | Target Time | Float (ms) | The "Elite Benchmark." The time a top 1% performer takes to solve this specific difficulty level. |
| **** | Change Count | Integer  | Number of times the answer selection was toggled before submission. |

#### Tunable Constants (The "Knobs"):

| Constant | Value (Rec.) | Description |
| --- | --- | --- |
| ** (Lambda)** |  | **The Decay Factor.** A higher value makes the score drop off faster as time passes.  ensures that meeting the  exactly retains  of the max potential points. |
| ** (Alpha)** |  | **The Uncertainty Penalty.** The percentage of score lost per answer toggle (e.g., 5%). |

---

### 2. The Components Breakdown

#### A. The Difficulty Scaler ()

We raise Difficulty to the power of 1.5 (or squared, ) rather than keeping it linear.

* **Reasoning:** Solving a Difficulty 10 problem is exponentially more valuable than solving a Difficulty 1 problem. This prevents users from "gaming" the system by answering easy questions quickly.

#### B. The Time Decay ()

* **Logic:** As  increases, the multiplier approaches 0, but never becomes negative.
* **The "Elite" Zone:** If a user answers *faster* than the target (), the exponent becomes a smaller negative number, pushing the multiplier closer to 1 (Maximum Efficiency).

#### C. The Stability Penalty ()

This penalizes "guessing" or "fidgeting." We use a clamped linear penalty.

* **Logic:** Each answer change removes 5% () of the raw score.
* **The Clamp:** The  function ensures that even if a user toggles the answer 20 times, they can still get *some* points (50% floor) if they eventually get it right. This prevents a correct answer from ever scoring 0.

---

### 3. The Adaptive Logic (The Engine)

This determines which question is served next. It does not look at the Score (), but rather the **Performance Ratio ()**.

| Condition | Logic | Next Question Action | System Interpretation |
| --- | --- | --- | --- |
| **Incorrect ()** | N/A | **Difficulty -1** | User hit failure point. Reduce load. |
| **Correct () AND...** |  |  |  |
|  | "Super Speed" | **Difficulty +2** | User is bored/overqualified. Aggressive jump. |
|  | "In Flow" | **Difficulty +1** | User is performing optimally. Standard progression. |
|  | "Struggling" | **Difficulty +0** | User got it right, but too slowly. Do not increase difficulty. |

---

### 4. The Skip Protocol

You mentioned "Skipped Questions" as a factor. In an efficiency test, skipping is a **strategic resource**.

* **Score Impact:**  (No points awarded).
* **Adaptive Impact:** **Difficulty +0** (No change).
* **Reasoning:** Unlike a wrong answer (which implies inability), a skip implies *time management strategy*. We do not lower the difficulty, but we do not award points. This prevents the user from tanking their difficulty on purpose to get easier points later.

### 5. Final Aggregation

The Total "Elite Quotient" () is not just the sum. It is the sum normalized by the highest difficulty reached.

### Summary for Production

To build this, your backend needs:

1. **Metadata tables** for every question containing a validated  (Target Time).
2. **Frontend listeners** to capture `onclick` events (for ) and precise timestamps (for ).
3. **The Formula:**