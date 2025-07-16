# Ctrl PLUS Wrapped

### Your internet journey, wrapped up in one scroll.

Ctrl PLUS Wrapped is a web application that takes your Chrome browsing history and transforms it into a shareable, insightful summary, similar to Spotify Wrapped. Discover your browsing habits, top sites, and more, all through a fun and visually appealing interface.

![Ctrl PLUS Wrapped Screenshot](https://placehold.co/800x400/ddeb9d/143d60?text=Ctrl+PLUS+Wrapped)

---

## How It Works

The process is simple and designed with your privacy in mind:

1.  **Export Your History**: Go to your Chrome History and export your browsing data. This will download a `history.json` file to your computer.
2.  **Upload the File**: Log in to Ctrl PLUS Wrapped and upload the `history.json` file.
3.  **Instant Analysis**: All processing happens **directly in your browser**. Your history file is never uploaded to a server, ensuring your data remains completely private.
4.  **View Your Wrapped**: You are instantly redirected to a results page that displays a variety of fun insights about your browsing habits.

---

## Features

-   **Secure User Authentication**: Full registration and login system powered by Appwrite Cloud.
-   **Client-Side Processing**: All analysis is done on the user's machine, meaning browsing history is never sent to a server.
-   **Detailed Insights**: Generates a variety of statistics about your browsing habits, including:
    -   Top 5 most visited websites.
    -   Your "Prime Time" busiest browsing hour.
    -   "Night Owl" or "Early Bird" awards.
    -   Percentage of browsing that starts with a Google search.
    -   Your deepest "Rabbit Hole" (most consecutive visits to a single site).
-   **Responsive Design**: A clean and modern UI that works seamlessly on all screen sizes.
-   **Content Protection**: Includes measures to prevent unauthorized copying and downloading of content.

---

## Tech Stack

-   **Frontend**: Vanilla JavaScript, HTML5, CSS3
-   **Backend-as-a-Service (BaaS)**: [Appwrite Cloud](https://appwrite.io/) for user authentication.
-   **Development Server**: [http-server](https://www.npmjs.com/package/http-server)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js and npm (Node Package Manager)
-   An Appwrite Cloud account (the free tier is sufficient)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your_username/ctrl-plus-wrapped.git](https://github.com/your_username/ctrl-plus-wrapped.git)
    cd ctrl-plus-wrapped
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Appwrite:**
    -   Log in to your Appwrite Cloud account and create a new project.
    -   In your project's dashboard, add a **Web platform**. Use `http://localhost:8080` for local development.
    -   Go to the **Auth** section and enable the **Email/Password** provider.
    -   Navigate to `src/js/appwrite.js` and update the `setProject` value with your own Appwrite Project ID.
    ```javascript
    const client = new Client()
        .setEndpoint('[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)') // Or your custom endpoint
        .setProject('YOUR_PROJECT_ID'); // <-- Replace with your Project ID
    ```

4.  **Start the development server:**
    ```sh
    npm start
    ```
    Your application will be available at `http://localhost:8080`.

---

## A Note on Privacy

Your privacy is the top priority. Ctrl PLUS Wrapped is built to be a "client-side first" application. This means that the sensitive data from your `history.json` file is **never uploaded to any server**. All parsing, analysis, and calculations are performed locally on your computer using JavaScript running in your browser.

---

## Future Work

-   **Visual Slideshow**: Transform the current results page into an animated, card-based slideshow.
-   **More Insights**: Add more advanced data analysis to provide even deeper insights.
-   **LLM Integration**: Explore an optional feature to send anonymized, summarized data to an LLM like Gemini for more creative, narrative-based insights.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
