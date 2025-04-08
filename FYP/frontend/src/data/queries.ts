import { gql } from "graphql-tag";

export const LOGIN_TUTOR_MUTATION = gql`
  mutation LoginTutor($email: String!, $password: String!) {
    loginTutor(email: $email, password: $password) {
      id
      name
      email
      token
      image
    }
  }
`;

export const REGISTER_TUTOR_MUTATION =  gql`
mutation RegisterTutor($name: String, $email: String, $password: String, $image: String, $hourlyRate: Int, $subjects: [String], $workingHours: [WorkingHourInput]) {
  registerTutor(name: $name, email: $email, password: $password, image: $image, hourlyRate: $hourlyRate, subjects: $subjects, workingHours: $workingHours) {
    id
    name
    email
    token
  }
}
`

export const REGISTER_STUDENT_MUTATION = gql`
  mutation RegisterStudent(
    $name: String!
    $email: String!
    $password: String!
    $weakPoints: [String!]
    $image: String
  ) {
    registerStudent(
      name: $name
      email: $email
      password: $password
      weakPoints: $weakPoints
      image: $image
    ) {
      id
      name
      email
      weakPoints
      image
      token
    }
  }
`;

export const LOGIN_STUDENT_MUTATION = gql`
  mutation LoginStudent($email: String!, $password: String!) {
    loginStudent(email: $email, password: $password) {
      id
      name
      email
      token
      image
    }
  }
`;

export const GET_ADMIN_PROFILE_QUERY = gql`
  query GetAdminProfile {
    getAdminProfile {
      id
      name
      email
    }
  }
`;

export const REGISTER_ADMIN_MUTATION = gql`
  mutation RegisterAdmin($name: String!, $email: String!, $password: String!) {
    registerAdmin(name: $name, email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export const LOGIN_ADMIN_MUTATION = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export const GET_TUTORS_QUERY = gql`
  query GetTutors {
    tutors {
      id
      name
      email
      hourlyRate
      image
      workingHours {
        day
        startTime
        endTime
      }
      subjects
    }
  }
`

export const GET_TUTOR_QUERY = gql`
  query Tutor($id: ID!) {
    tutor(id: $id) {
      id
      name
      email
      hourlyRate
      subjects
      image
      workingHours {
        day
        startTime
        endTime
      }
    }
  }
`;

export const ADD_TUTOR_MUTATION = gql`
  mutation AddTutor(
    $name: String!
    $email: String!
    $password: String!
    $hourlyRate: Float!
    $subjects: [String!]!
    $image: String
    $workingHours: [InputWorkingHours!]
  ) {
    addTutor(
      name: $name
      email: $email
      password: $password
      hourlyRate: $hourlyRate
      subjects: $subjects
      image: $image
      workingHours: $workingHours
    ) {
      id
      name
      email
      token
    }
  }
`;

export const UPDATE_TUTOR_MUTATION = gql`
  mutation UpdateTutor(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $hourlyRate: Float
    $subjects: [String!]
    $image: String
    $workingHours: [InputWorkingHours!]
  ) {
    updateTutor(
      id: $id
      name: $name
      email: $email
      password: $password
      hourlyRate: $hourlyRate
      subjects: $subjects
      image: $image
      workingHours: $workingHours
    ) {
      id
      name
      email
      hourlyRate
      subjects
      image
      workingHours {
        day
        startTime
        endTime
      }
    }
  }
`;

export const DELETE_TUTOR_MUTATION = gql`
  mutation DeleteTutor($id: ID!) {
    deleteTutor(id: $id) {
      id
      name
    }
  }
`;

export const GET_STUDENTS_QUERY = gql`
  query Students {
    students {
      id
      name
      email
      enrolledCourses
      weakPoints
    }
  }
`;

export const GET_STUDENT_QUERY = gql`
  query Student($id: ID!) {
    student(id: $id) {
      id
      name
      email
      enrolledCourses
      weakPoints
    }
  }
`;

export const ADD_STUDENT_MUTATION = gql`
  mutation AddStudent(
    $name: String!
    $email: String!
    $password: String!
    $weakPoints: [String!]
  ) {
    addStudent(
      name: $name
      email: $email
      password: $password
      weakPoints: $weakPoints
    ) {
      id
      name
      email
      token
    }
  }
`;

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudent(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $weakPoints: [String!]
    $enrolledCourses: [String!]
    $image: String
  ) {
    updateStudent(
      id: $id
      name: $name
      email: $email
      password: $password
      weakPoints: $weakPoints
      enrolledCourses: $enrolledCourses
      image: $image
    ) {
      id
      name
      email
      weakPoints
      enrolledCourses
      image
    }
  }
`;

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
      name
    }
  }
`;

export const GET_NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      recipient
      message
      read
    }
  }
`;

export const GET_NOTIFICATION_QUERY = gql`
  query Notification($id: ID!) {
    notification(id: $id) {
      id
      recipient
      message
      read
    }
  }
`;

export const ADD_NOTIFICATION_MUTATION = gql`
  mutation AddNotification($recipient: ID!, $message: String!) {
    addNotification(recipient: $recipient, message: $message) {
      id
      recipient
      message
      read
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

export const GET_SUBJECTS_QUERY = gql`
  query GetSubjects {
    subjects {
      id
      name
    }
  }
`