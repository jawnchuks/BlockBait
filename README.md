# BlockBait - Phish Blocking Chrome Extension

![BlockBait Banner](./public/images/blockbait-banner.png)

BlockBait is a Chrome extension that helps protect users from phishing attacks by blocking known phishing websites. It is built using Next.js, Tailwind CSS, and Chrome APIs.

## Installation

To install the BlockBait Chrome extension, follow these steps:

1. Clone the repository:
   ```
   git clone [repository-url]
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Build the extension:
   ```
   yarn build:extension
   ```

   The `build:extension` script is a custom Node script defined in the `package.json` file. It runs Next.js build and export commands to generate the static files for the extension. The script also renames the files and replaces certain content to ensure compatibility with the Chrome extension structure.

4. Open the Chrome web browser and go to `chrome://extensions`.

5. Enable the `Developer mode` toggle switch.

6. Click the `Load unpacked` button and select the `out` directory.

7. The BlockBait extension should now be installed in your Chrome browser.

## Usage

Once the BlockBait extension is installed, it will automatically block known phishing websites and display notifications to the user. The extension works in the background and provides real-time protection against phishing attacks.

## Folder Structure

The folder structure of the BlockBait project is as follows:

- `src`: Contains the source code of the extension.
  - `styles`: Includes styling files for the extension.
  - `pages`: Contains the main pages of the extension.
  - `helpers`: Contains utility functions used in the extension.
  - `components`: Contains reusable components used in the extension.
- `public`: Contains static assets and configuration files.
  - `manifest.json`: Configuration file for the Chrome extension.
  - `static`: Includes JSON files for blacklist and whitelist data.
  - `icons`: Contains icons used by the extension.
  - `background`: Includes background scripts for the extension.
  - `images`: Contains images used for the extension, including the banner image.
- `out`: The output directory where the extension is built.

## Contributing

Contributions to the BlockBait project are welcome. If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

The BlockBait project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.

## Credits

This project was inspired by the original PhishDetector Chrome extension. Special thanks to the contributors of the PhishDetector project.

## Support

If you encounter any issues or have questions about the BlockBait extension, please feel free to contact the project maintainers or open an issue on the repository.

## Related Links

<!-- - [Chrome Web Store](https://chrome.google.com/webstore/detail/blockbait-phish-blocking/kgecldbalfgmgelepbblodfoogmjdgmj) -->
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)