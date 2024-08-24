const getWelcomePageHtml = () => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bookstore API Documentation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              text-align: center;
              padding: 0;
              margin: 0;
          }
          .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
          }
          h1 {
              color: #5a5a5a;
              margin-top: 20px;
          }
          p {
              font-size: 18px;
              color: #666;
          }
          a {
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
          }
          a:hover {
              text-decoration: underline;
          }
          .logo {
              width: 150px;
              margin: 20px auto;
          }
          .footer {
              margin-top: 40px;
              font-size: 14px;
              color: #999;
          }
      </style>
  </head>
  <body>
      <div class="container">
           <img src="https://res.cloudinary.com/dftxzx2zc/image/upload/v1724451272/cv/f0etakxap6h4fmbtksgt.png" alt="Bookstore Logo" class="logo">
          <h1>Welcome to the Bookstore API Documentation!</h1>
          <p>Explore our API endpoints and detailed documentation to integrate seamlessly with our service.</p>
          <p>For comprehensive API details, please visit the <a href="https://bookstore-kkir.onrender.com/api-docs" target="_blank">API Documentation</a>.</p>
          <div class="footer">
              <p>mohammad.rammal@hotmail.com</p>
          </div>
      </div>
  </body>
  </html>
`;

module.exports = getWelcomePageHtml;
