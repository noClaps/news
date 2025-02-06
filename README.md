# News

A minimal Hacker News client.

## Build instructions

You will need [Bun](https://bun.sh) to build and run this site.

1. Clone the repository.

   ```sh
   git clone https://gitlab.com/noClaps/news.git
   cd news/
   ```

2. Start the development server.

   ```sh
   bun dev
   ```

   This will start a dev server at `http://localhost:3000`.

3. Build the site.

   ```sh
   bun run build
   ```

   This will build the site and place the output into the `dist/` directory.
