# Quiz Application

A RESTful Quiz Application built with Spring Boot and PostgreSQL that allows users to create quizzes, retrieve questions, and submit answers for automatic grading.

## 🚀 Features

- **Question Management**: Add and retrieve quiz questions by category
- **Quiz Creation**: Generate random quizzes from a question bank based on category
- **Quiz Retrieval**: Get quiz questions without revealing correct answers
- **Answer Submission**: Submit quiz responses and receive automatic scoring
- **PostgreSQL Integration**: Persistent data storage with JPA/Hibernate

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot 4.0.1**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok**
- **Maven**

## 📋 Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SpringBoot
```

### 2. Configure PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE questiondb;
```

### 3. Update Application Properties

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/questiondb
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.port=8083
```

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
.\mvnw.cmd spring-boot:run
```

The application will start on `http://localhost:8083`

## 📊 Database Schema

### Question Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-generated question ID |
| question_title | String | The question text |
| option1 | String | First answer option |
| option2 | String | Second answer option |
| option3 | String | Third answer option |
| option4 | String | Fourth answer option |
| right_answer | String | Correct answer |
| difficulty_level | String | Question difficulty |
| category | String | Question category (e.g., "Java", "Python") |

### Quiz Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-generated quiz ID |
| title | String | Quiz title |

### Quiz_Questions Table (Join Table)

| Column | Type | Description |
|--------|------|-------------|
| quiz_id | Integer (FK) | Reference to quiz |
| questions_id | Integer (FK) | Reference to question |

## 🔌 API Endpoints

### Question Endpoints

#### Get All Questions
```http
GET /question/allQuestions
```

**Response:**
```json
[
  {
    "id": 1,
    "questionTitle": "What is the size of int in Java?",
    "option1": "32",
    "option2": "64",
    "option3": "128",
    "option4": "127",
    "rightAnswer": "127",
    "difficultyLevel": "Easy",
    "category": "Java"
  }
]
```

#### Get Questions by Category
```http
GET /question/category/{category}
```

**Example:**
```http
GET /question/category/Java
```

#### Add a Question
```http
POST /question/add
Content-Type: application/json
```

**Request Body:**
```json
{
  "questionTitle": "What keyword is used for inheritance in Java?",
  "option1": "implements",
  "option2": "extends",
  "option3": "inherits",
  "option4": "super",
  "rightAnswer": "extends",
  "difficultyLevel": "Easy",
  "category": "Java"
}
```

### Quiz Endpoints

#### Create a Quiz
```http
POST /quiz/create?category={category}&numQ={number}&title={title}
```

**Example:**
```http
POST /quiz/create?category=Java&numQ=5&title=JQuiz
```

**Response:**
```
Success
```

#### Get Quiz Questions
```http
GET /quiz/get/{id}
```

**Example:**
```http
GET /quiz/get/3
```

**Response:**
```json
[
  {
    "id": 12,
    "questionTitle": "What is a String in Java?",
    "option1": "primitive",
    "option2": "object",
    "option3": "string",
    "option4": "class"
  },
  {
    "id": 25,
    "questionTitle": "What keyword is used for inheritance?",
    "option1": "implements",
    "option2": "extends",
    "option3": "inherits",
    "option4": "super"
  }
]
```

> **Note:** The correct answers are **not** included in the response to prevent cheating.

#### Submit Quiz Answers
```http
POST /quiz/submit/{id}
Content-Type: application/json
```

**Example:**
```http
POST /quiz/submit/3
```

**Request Body:**
```json
[
  {
    "id": 12,
    "response": "string"
  },
  {
    "id": 25,
    "response": "extends"
  },
  {
    "id": 1,
    "response": "127"
  },
  {
    "id": 27,
    "response": "3"
  },
  {
    "id": 28,
    "response": "3"
  }
]
```

**Response:**
```
5
```
> Returns the number of correct answers

## 🧪 Testing with Postman

### Example Workflow

1. **Add Questions** to the database using `POST /question/add`
2. **Create a Quiz** using `POST /quiz/create?category=Java&numQ=5&title=MyQuiz`
3. **Retrieve Quiz Questions** using `GET /quiz/get/{quizId}`
4. **Submit Answers** using `POST /quiz/submit/{quizId}` with your responses
5. **Get Score** - The response will show how many answers were correct

## 📁 Project Structure

```
SpringBoot/
├── src/
│   ├── main/
│   │   ├── java/com/quiz/demo/
│   │   │   ├── controller/
│   │   │   │   ├── QuestionController.java
│   │   │   │   └── QuizController.java
│   │   │   ├── dao/
│   │   │   │   ├── QuestionDao.java
│   │   │   │   └── QuizDao.java
│   │   │   ├── model/
│   │   │   │   ├── Question.java
│   │   │   │   ├── Quiz.java
│   │   │   │   ├── QuestionWrapper.java
│   │   │   │   └── Response.java
│   │   │   ├── service/
│   │   │   │   ├── QuestionService.java
│   │   │   │   └── QuizService.java
│   │   │   └── DemoApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## 🔍 Key Implementation Details

### Random Question Selection

The application uses a native PostgreSQL query to select random questions:

```java
@Query(value="SELECT * FROM question q WHERE q.category = :category ORDER BY RANDOM() LIMIT :numQ", nativeQuery=true)
List<Question> findRandomQuestionsByCategory(String category, int numQ);
```

### Answer Validation

The quiz grading system matches responses by question ID (not by array index) to ensure correct scoring regardless of submission order:

```java
for(Response response: responses){
  for(Question question : questions){
    if(question.getId().equals(response.getId())){
      if(response.getResponse().equals(question.getRightAnswer())){
        right++;
      }
      break;
    }
  }
}
```

## 🐛 Troubleshooting

### Issue: Empty quiz_questions table

**Problem:** Quiz is created but the `quiz_questions` join table remains empty.

**Solution:** Ensure the `@ManyToMany` relationship in the `Quiz` entity is properly configured. The application uses JPA's default join table strategy.

### Issue: Incorrect quiz scores

**Problem:** Submitted answers show incorrect scores.

**Solution:** Ensure your response JSON includes the correct question IDs and that answers match exactly (case-sensitive) with the stored `rightAnswer` values.

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a Spring Boot learning project.
