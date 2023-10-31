# `harmor` - Your HAR Armor

Safeguard your HAR (HTTP Archive) files with `harmor`. It's like armor for your HAR files!

## Table of Contents

- [Usage](#usage)
- [Template Format](#template-format)
- [Features](#features)
- [License](#license)

## Usage

There's no need for a global installation. Simply use `harmor` with `npx` whenever you need it!

### Basic Usage:

To sanitize a HAR file:

```bash
npx harmor path_to_your_file.har
```

This will guide you through a questionnaire in the CLI, allowing you to customize the sanitization process based on your
preferences.

### Using a Template:

For a more streamlined process, you can use a template:

```bash
npx harmor --template=harmor.template.json path_to_your_file.har
```

Simply replace `harmor.template.json` with the path to your template file.

## Template Format

Your template file should be a JSON file with your sanitization preferences.
Detailed documentation on the template format will be added soon.

You can simply use the CLI questionnaire to generate a template file for you.

## Features

- **Easy to Use**: No need for a global installation. Use it directly with `npx`.
- **Customizable**: Follow the CLI questionnaire to customize the sanitization to your liking.
- **Template Support**: Use a template for a more streamlined process.

## Contributing

Interested in contributing to `harmor`? We'd love to have you! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for
guidelines.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
