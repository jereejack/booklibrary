# Book Library Catalog

This project is a basic web application that serves as a book library catalog. It consists of a REST API backend and a simple frontend interface, catering to two types of users: Readers and Librarians.

## Project Overview

### User Types and Functionalities

#### Reader (No Authentication Required)
- **Browse Books**: Public users can explore the library's collection by listing books based on genre, author, or title. No login is required.

#### Librarian (Authentication Required)
- **Manage Books**: Librarians can manage the book catalog after logging in. They can:
  - **Add New Books (POST)**: Introduce new books to the catalog with title, author, and genre.
  - **Update Existing Books (PATCH)**: Modify information about books already in the catalog.
  - **Delete Books (DELETE)**: Remove books from the catalog that are no longer available or relevant.

## Project Requirements

1. **Proposal**
   - **PROPOSAL.md**: Contains a brief description of the web application concept, REST API endpoint design, and a preliminary project plan outlining major milestones and timelines.

2. **Development**
   - **Authentication**: Uses JWT for authentication.
   - **Database**: Utilizes PostgreSQL for data management.
   - **Backend**: Built with Express.js to handle application logic, database connection, and REST API communication.
   - **Frontend**: Built using responsive HTML5/CSS3 and JavaScript, utilizing Alpine.js and Fetch API.
