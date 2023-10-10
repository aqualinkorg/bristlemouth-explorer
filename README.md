# bristlemouth-explorer
Dev tools and playground for the Bristlemouth  open source standard

## Adding a New Decoder
New decoders can easily be added to the app by submitting a pull request in this repository, following these steps:
1. Create a new file under `src/decoders` and export the new decoder. Ensure that your decoder implements the `Decoder` interface. You can refer to `src/decoders/default.ts` as an example
2. Import and append the new decoder to the `decoders` variable at the end of `src/helpers/decoder.ts` file

Once your pull request is merged, your new decoder will become accessible in the drop-down list, just like the existing ones!

## License

  bristlemouth-explorer is [MIT licensed](LICENSE).
