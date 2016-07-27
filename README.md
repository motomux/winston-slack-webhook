# winston-slack-webhook
------

## Installation

```
  npm install -S winston winston-slack-webhook
```

## Usage

### Set up with transports

```
  var winston = require('winston');
  var SlackWebHook = require('winston-slack-webhook').SlackWebHook;

  var logger = new winston.Logger({
    level: 'info',
    transports: [
      new (winston.transports.Console)(),
      new SlackWebHook({
        level: 'error',
        webhookUrl: 'https://hooks.slack.com/services/xxx/xxx/xxx',
        channel: '#error_logs',
        username: 'logger'
      })
    ]
  });

  logger.info('Created logger');
  logger.error('Something wrong!!');
```

### Set up by adding

```
  var winston = require('winston');
  var SlackWebHook = require('winston-slack-webhook').SlackWebHook;

  var logger = new winston.Logger();
  logger.add(SlackWebHook, {
    level: 'error',
    webhookUrl: 'https://hooks.slack.com/services/xxx/xxx/xxx',
    channel: '#error_logs',
    username: 'logger'
  });
```

### Options

- **webhookUrl**: Slack incoming webhook url (required)
- **channel**: Slack channel to post to. (optional [^1])
- **username**: User name to post as. (optional [^1])
- **iconEmoji**: Icon to post as. (optional [^1])
- **iconUrl**: Icon to post as. (either iconEmoji or iconUrl will be used)
- **formatter**: Custom function to format logs. (optional)
- **level**: Level to log. (global settings will be applied if level is blank)
- **unfurlLinks**: Whether to [unfurl links](https://api.slack.com/docs/message-attachments#unfurling) in Slack (optional)

[^1]: Integration settings on slack will be applied if it's blank.
