package MyServlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class CustomerInput extends HttpServlet {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/medivault";
    private static final String JDBC_USER = "root";
    private static final String JDBC_PASSWORD = "root";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String address = request.getParameter("address");

        try {
           
            Class.forName("com.mysql.cj.jdbc.Driver");

            
            Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);

            String sql = "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, phone);
            pstmt.setString(3, email);
            pstmt.setString(4, address);

            
            int rowsInserted = pstmt.executeUpdate();
            if (rowsInserted > 0) {
                response.getWriter().write("<h3>Customer added successfully!</h3>");
            } else {
                response.getWriter().write("<h3>Failed to add customer.</h3>");
            }

           
            pstmt.close();
            conn.close();
        } catch (ClassNotFoundException e) {
            response.getWriter().write("<h3>MySQL Driver not found!</h3>");
            e.printStackTrace();
        } catch (SQLException e) {
            response.getWriter().write("<h3>Database error: " + e.getMessage() + "</h3>");
            e.printStackTrace();
        }
    }
}
