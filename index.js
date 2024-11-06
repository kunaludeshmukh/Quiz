const progressBar = document.querySelector(".progress-bar"),
progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value/time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

let questions = [],
time = 30,
score = 0,
currentQuestion,
timer;

const startBtn = document.querySelector(".start"),
      numQuestions = document.querySelector("#num-questions"),
      category = document.querySelector("#category"),
      difficulty = document.querySelector("#difficulty"),
      timePerQuestion = document.querySelector("#time"),
      quiz = document.querySelector(".quiz"),
      startscreen = document.querySelector(".start-screen");

const startQuiz = () => {
    const num = numQuestions.value;
    cat = category.value;
    diff = difficulty.value;
    //api url 
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
      .then((res)=>res.json())
      .then((data)=>{
        questions = data.results;
        startscreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      });
};

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
      nextBtn = document.querySelector(".next");

const showQuestion = (question)=>{
    const questionText = document.querySelector(".question"),
        answersWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");
    
    questionText.innerHTML = question.question;

    //correct an wrong answers are seprate lets mix them
    const answers = [
        ...question.incorrect_answers,
         question.correct_answer.toString(),
    ];

    answers.sort(()=>Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer)=>{
        answersWrapper.innerHTML += `
        <div class="answer ">
                <span class="text">${answer}</span>
                <span class="checkbox">
                    <span class="icon">&#10003</span>
                </span>
            </div>
        `;
    });

    questionNumber.innerHTML = `
    Quesrion <span class = "current">${
        questions.indexOf(question) + 1
    }</span><span class = "total">/${questions.length}</span>
    `;

    // lets add event listner on answer

    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer)=>{
        answer.addEventListener("click", ()=>{
            if(!answer.classList.contains("checked")){
                answersDiv.forEach((answer)=>{
                    answer.classList.remove("selected");
                });
                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    //after updating question start timer
    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    timer = setInterval(()=>{
        if(time >= 0){
            progress(time);
            time --;
        }else{
            checkAnswer();
        }
    }, 1000);
};

submitBtn.addEventListener("click", ()=>{
    checkAnswer();
});

const checkAnswer = () => {
    clearInterval(timer);

    const selectedAnswer = document.querySelector(".answer.selected");
    if(selectedAnswer){
        const answer = selectedAnswer.querySelector(".text");
        if(answer === questions[currentQuestion - 1].correct_answer){
            score++;
            selectedAnswer.classList.add("correct");
        }else{
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document
            .querySelectorAll(".answer")
            .forEach((answer)=>{
                if(
                    answer.querySelector(".text").innerHTML ===
                    questions[currentQuestion - 1].correct_answer
                ) {
                    answer.classList.add("correct");
                }
            });
        }
    }
    //answer check will also be triggered when time reaches 0
    // if nothing selected and time finishes
    else{
        const correctAnswer = document
        .querySelectorAll(".answer")
            .forEach((answer)=>{
                if(
                    answer.querySelector(".text").innerHTML ===
                    questions[currentQuestion - 1].correct_answer
                ) {
                    answer.classList.add("correct");
                }
            });
    }

    // block user to select further answer
    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer)=>{
        answer.classList.add("checked");
    });

    //after submit show next btn to go to next question 
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

//on next btn click show next question 

nextBtn.addEventListener("click",()=>{
    nextQuestion();
    //also show submit btn on next question and hide next btn
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});

const nextQuestion = () =>{
    if(currentQuestion < questions.length){
        currentQuestion++;
        //show question
        showQuestion(questions[currentQuestion-1]);
    }else{
        //if no question remeaning
        showScore();
    }
};

const endscreen = document.querySelector(".end-screen"),
     finalScore = document.querySelector(".final-score"),
     totalScore = document.querySelector(".total-score");

const showScore = () => {
    endscreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});