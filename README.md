
# generate-shades-from-css

Generate OKLCH color shade ladders from CSS custom properties for modern theming.

## Features
- Parses CSS files for variables starting with `--generate-color-...`
- Outputs a `@theme` block with OKLCH lightness steps for each color
- CLI tool with modern argument parsing and help
- Supports output as hex or OKLCH (`oklch(...)`) via a flag
- Generates paired `light-dark()` variables for easy theming

## Installation

### Using npm (recommended)
```sh
npm install -g cli-hue-forge
```

### Using pnpm
```sh
pnpm add -g cli-hue-forge
```

### Local usage
Clone or download this repo, then run:
```sh
pnpm install
```

## Usage


### CLI
```sh
hueforge --input <yourfile.css>
```
Or with the short flag:
```sh
hueforge -i <yourfile.css>
```


#### Options
- `-i, --input <file>`: Path to the input CSS file (required)
- `-o, --oklch`: Output colors as oklch(...) instead of hex
- `-f, --file <output>`: Output file (e.g. gen.css). If not set, prints to stdout.
- `-h, --help`: Show help message

### Example
Suppose your CSS contains:
```css
:root {
  --generate-color-primary: #e6b97a;
  --generate-color-accent: rgb(120, 200, 255);
}
```



#### Hex output (default)
```sh
hueforge -i theme.css
```
Output:
```css
@theme {
  --color-primary-98: #fff6e9;
  --color-primary-95: #ffe9c7;
  ...
  --color-primary-98-10: light-dark(var(--color-primary-98), var(--color-primary-10));
  ...
}
```



#### Output to file
```sh
hueforge -i theme.css -f gen.css
```
This writes the generated CSS to `gen.css`.

After generating `gen.css`, you can import it into your project's CSS file(s) using:
```css
@import "./gen.css";
```
This works with Tailwind CSS v4 and standard CSS workflows.



#### OKLCH output
```sh
hueforge -i theme.css --oklch
```
Output:
```css
@theme {
  --color-primary-98: oklch(98.00% 0.0957 75.09);
  --color-primary-95: oklch(95.00% 0.0957 75.09);
  ...
  --color-primary-98-10: light-dark(var(--color-primary-98), var(--color-primary-10));
  ...
}
```


You can combine both flags:
```sh
hueforge -i theme.css --oklch -f gen.css
```
This writes OKLCH output to `gen.css`.

## Contributing
Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

## License
MIT

## Support
For help or questions, open an issue at:
https://github.com/maxiviper117/cli-hue-forge/issues
