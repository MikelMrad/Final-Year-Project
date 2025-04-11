import { gql } from "@apollo/client";

export const GET_ALL_TUTORS = gql`
  query GetTutors {
    tutors {
      id
      name
      email
      hourlyRate
      image
      subjects
      workingHours {
        day
        startTime
        endTime
      }
      subjects
    }
  }
`;

export const GET_TUTOR = gql`
  query GET_TUTOR($id: ID!) {
    tutor(id: $id) {
      id
      name
      email
      hourlyRate
      subjects
    }
  }
`;

export const UPDATE_TUTOR = gql`
  mutation UpdateTutor(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $hourlyRate: Float
    $subjects: [String]
    $image: String
    $workingHours: [InputWorkingHours]
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
    }
  }
`;

export const DELETE_TUTOR = gql`
  mutation DeleteTutor($id: ID!) {
    deleteTutor(id: $id) {
      id
      name
    }
  }
`;

export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    students {
      id
      name
      email
      weakPoints
      appointments {
        id
        date
        tutor {
          name
        }
      }
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      name
      email
      image
      weakPoints
      appointments {
        id
        date
        tutor {
          name
        }
      }
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $name: String, $email: String, $password: String, $weakPoints: [String], $appointments: [ID], $image: String) {
    updateStudent(id: $id, name: $name, email: $email, password: $password, weakPoints: $weakPoints, appointments: $appointments, image: $image) {
      id
      name
      email
      weakPoints
      image
      appointments {
        id
        date
      }
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
      name
    }
  }
`;

export const GET_ALL_APPOINTMENTS = gql`
  query GetAllAppointments {
    appointments {
      id
      date
      confirmed
      tutor {
        id
        name
      }
      student {
        id
        name
      }
    }
  }
`;

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      date
      confirmed
      tutor {
        name
      }
      student {
        name
      }
    }
  }
`;

export const CONFIRM_APPOINTMENT = gql`
  mutation ConfirmAppointment($id: ID!) {
    confirmAppointment(id: $id) {
      id
      confirmed
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id) {
      id
      date
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

