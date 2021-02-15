# CryptoTracker

A discord bot that web scrapes from messari.io for real-time cryptocurrency tracking using Seleninum. 

### THIS IS IN BETA AND WILL NOT PROPERLY FUNCTION, IT IS NOT GUARENTEED TO WORK.

If you want to try the bot out, do as follows.

- Add a `utils` folder.
- Inside, place a `config.json` file and a `database.json` file.

These files need to be as show - 

**config.json**
```
{
    "token": "discord-bot-token",
    "admins": [your-user-id],
    "prefix": "!",
    "validValues": [
        "high",
        "low"
    ],
    "validSymbols": [
        [
            "btc",
            "Bitcoin",
            "bitcoin"
        ],
    ]
}
```

**database.json**
```
{
    "connectionLimit": 100000000000,
    "host": "host",
    "user": "user",
    "password": "password",
    "database": "database"
}
```

The database requres two tables **(MYSQL)**:

- `mastercryptos` table with columns:
  - `symbol`: VARCHAR 10 : symbol of the cryptocurrency,
  - `tracking`: BOOLEAN : whether the crypto is being tracked

- `triggers` table with columns:
  - `user-id`: VARCHAR 100 : user-id of the user with the trigger,
  - `symbol`: VARCHAR 10 : symbol of the cryptocurrency,
  - `value`:  VARCHAR 10 : a valid value, as descriped in the `config.json` file,
  - `triggervalue`: INT : the price to trigger at

With all of this properly set up, the bot should work.
