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

export const DELETE_TUTOR = gql`
  mutation DeleteTutor($id: ID!) {
    deleteTutor(id: $id) {
      message
    }
  }
`;

export const GET_ALL_STUDENTS = gql`
query Students {
    students {
      id
      name
      email
      weakPoints
      image
      appointments {
        id
        date
        confirmed
        tutor {
          id
          name
          email
        }
      }
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      message
    }
  }
`;

export const GET_ALL_APPOINTMENTS = gql`
  query {
    getAllAppointments {
      _id
      tutorName
      studentName
      date
      time
      status
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    deleteAppointment(id: $id) {
      message
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

