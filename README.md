# coyote-chingus-pengo
A practice project to reverse engineer the Pengo bot

## Original File Structure
```yml
app/                          # Core bot backend
  |- getCommand.js            # Their WIP backend helper to search the linux man pages. (Try `/pengo bash abc` in Slack).
  |- getQuote.js              # Backend helper to return quotes. Exports 2 functions (one to get a quote by ID, one for random quote).
  |- initializeQuoteDB.js     # Run once to seed and save hard-coded quote text data into the mongoDB instance.
  `- pengo.js                 # Backend ENTRY POINT: parses Slack's /slash command text to invoke the right helper function.
images/                       # Static assets served by backend.
  |- pengo.jpg
  `- rant.png
models/                       # (The 'M' model in MVC pattern). In this case, seems like there are no Views and the Controllers are inside app/ folder).
  |- quoteSchema.js           # Holds mongoose Quote model. 
public/
  |- index.html               # Frontend landing page.
  `- pengo.jpg
Procfile                      # Specifies dyno process and run command in Heroku (during deployment).
package.json                  # npm package info.
server.js                     # ENTRY POINT: 
                              # contains app route path endpoints 
                              # ( GET /auth, GET /, POST / ) where "/" is the root
```

## Practice File Structure
```yml
README.md       # Project description.
quotes.json     # Data file to simulate database (the quote data never changes during runtime).
server.js       # node.js entry point.
```
