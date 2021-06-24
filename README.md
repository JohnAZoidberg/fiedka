# UTK Web ⚙️

This is a web tool rendering [UEFI](https://uefi.org/) firmware images visually.

![utk-web screenshot](docs/img/utk-web.png)

## Usage

Currently, there are the following types of pages (views):

- UEFI explorer
- PSP explorer

See also [TODO](#todo) and [Features](#features).

### Running utk-web

You need to have a [Node.js](https://nodejs.org/) runtime and `npm` installed.
Find them in your respective OS distribution and install them through your
package manager, e.g., `yay -S nodejs npm`.

Before proceeding please initialize and checkout submodules:

```
git submodule update --init --checkout
```


#### Installing dependencies

The project depends on a handful of packages from the npm registry. Run the
following to install them or update when pulling the utk-web repository:

`npm install`

#### Running utk-web

`npm start`

Then open [http://localhost:3000](http://localhost:3000) in a web browser.

#### Running utk-web in Docker

If want to avoid running npm on your host directly, you can build a Docker
image:

```
docker build -t orangecms/utk-web .
```

Then run:

```
docker run -p 3000:3000 orangecms/utk-web
```

Then open [http://localhost:3000](http://localhost:3000) in a web browser.

#### Build static pages for deployment

`npm run build`

This will generate a directory `out/` which you can put on a web server under
the path `/utk-web` for static serving. The configuration file `next.config.js`
determines that path. You can adjust it or remove the path according to your
setup.

### Generating Fixtures

To generate the fixtures for the respective view, you need to have the following
CLI tools installed:

- [Fiano](https://github.com/linuxboot/fiano)'s `utk` and `fmap`
- [uefi-firmware-parser](https://github.com/theopolis/uefi-firmware-parser)
- [PSPTool](https://github.com/pspreverse/psptool)
- [MFT CLI](https://github.com/Mimoja/MFT-AnalyserV2) from MFT Analyser v2
  (not yet upstream, see https://github.com/orangecms/MFT-AnalyserV2/tree/json)

By convention, the fixtures need to have specific names. Here is how to generate
them for a given firmware image. `FIRMWARE_IMAGE` be the path to the image file
and `FIRMWARE_IMAGE_NAME` the name for it to use in utk-web:

- `fmap jusage "${FIRMWARE_IMAGE}" > "src/fixtures/${FIRMWARE_IMAGE_NAME}.fmap.json"`
- `utk "${FIRMWARE_IMAGE}" json > "src/fixtures/${FIRMWARE_IMAGE_NAME}.json"`
- `uefi-firmware-parser --brute --json "${FIRMWARE_IMAGE}" > "src/fixtures/${FIRMWARE_IMAGE_NAME}.ufp.json"`
- `psptool --json "${FIRMWARE_IMAGE}" > "src/fixtures/${FIRMWARE_IMAGE_NAME}.psp.json"`
- `mftcli "${FIRMWARE_IMAGE}" json > "src/fixtures/${FIRMWARE_IMAGE_NAME}.mft.json"`

For convenience, there is a script: Run `./genfixtures.sh ${FIRMWARE_IMAGE}`,
supplying the path to your firmware image as the argument, to generate the
respective fixtures from the image file.

### Creating Pages

There are templates for the available kinds of pages in `src/templates/`. Simply
copy them to `src/pages/${FIRMWARE_IMAGE_NAME}.*.jsx`, replace the placeholders
with the paths to the respective fixtures, and add links to the pages to the
`src/pages/index.jsx` page to be able to navigate to them from the root page.

For convenience, there is a script: Run `./genpages.sh ${FIRMWARE_IMAGE_NAME}`,
supplying the name of your firmware image as the argument, to generate the
respective pages from the templates. However, you still need to manually add the
links to `src/pages/index.jsx`.

#### TODOs

- [ ] autogenerate pages from fixtures
- [ ] generate pages for MFT fixtures

## FAQ

> Is there demand?

Yes.

- [https://www.reddit.com/r/Amd/comments/7fr6ml/amd_secure_processor_or_platform_security/](
https://www.reddit.com/r/Amd/comments/7fr6ml/amd_secure_processor_or_platform_security/)
- [https://thinksystem.lenovofiles.com/help/index.jsp?topic=%2F7X01%2Fobservable_problems.html](
https://thinksystem.lenovofiles.com/help/index.jsp?topic=%2F7X01%2Fobservable_problems.html)
- [https://www.dell.com/community/PowerEdge-Hardware-General/Exception-during-the-UEFI-preboot-environment/td-p/7400227](
https://www.dell.com/community/PowerEdge-Hardware-General/Exception-during-the-UEFI-preboot-environment/td-p/7400227)
- [https://software.intel.com/content/www/us/en/develop/documentation/system-debug-legacy-user-guide/top/common-debugger-tasks/debugging-uefi-bios/debugging-in-the-dxe-phase.html](
https://software.intel.com/content/www/us/en/develop/documentation/system-debug-legacy-user-guide/top/common-debugger-tasks/debugging-uefi-bios/debugging-in-the-dxe-phase.html)

> Are there similar GUI tools?

There are proprietary, closed source, non-public tools limited to few platforms,
which are licensed by IBVs for OEMs under contract, such as AMI's [Aptio
Utilities](https://ami.com/ami_downloads/Aptio_Utilities_Data_Sheet.pdf).

> How does UEFI work?

Here's a picture of the boot flow [from the TianoCore/EDK2 wiki](
https://github.com/tianocore/tianocore.github.io/wiki/):

![UEFI boot flow](
https://raw.githubusercontent.com/tianocore/tianocore.github.io/master/images/PI_Boot_Phases.JPG)

> Is UEFI complicated?

The [UEFI 2.6 spec](
https://www.uefi.org/sites/default/files/resources/UEFI%20Spec%202_6.pdf) is
`2706` pages long. The [ACPI 6.3 Errata A spec](
https://uefi.org/sites/default/files/resources/ACPI_Spec_6_3_A_Oct_6_2020.pdf)
comprises `1062` pages.
The [Platform Initialization spec](https://uefi.org/sites/default/files/resources/PI_Spec_1_7_A_final_May1.pdf
) consists of `1541` pages.

> Is there research on UEFI implementations?

Yes. See [https://depletionmode.com/uefi-boot.html](
https://depletionmode.com/uefi-boot.html) for a decent introduction.

SentinelLabs have started a decent [blog post series](
https://labs.sentinelone.com/moving-from-common-sense-knowledge-about-uefi-to-actually-dumping-uefi-firmware/)
on the practical side of interfacing with firmware on real hardware.

> How are UEFI images created?

See [https://edk2-docs.gitbook.io/edk-ii-build-specification/2_design_discussion/22_uefipi_firmware_images
](https://edk2-docs.gitbook.io/edk-ii-build-specification/2_design_discussion/22_uefipi_firmware_images).

> Do UEFI images contain more than just the UEFI firmware?

Yes. On Intel platforms, (CS)ME and ethernet adapter firmware is included, and
likewise, PSP firmware on AMD platforms. This tool can already visualize output
from `PSPTool`. Depending on OEMs and boards, EC firmware may also be included.

> What is a typical UEFI firmware layout?

Full firmware images consist of regions. Intel uses the IFD (Intel Flash
Descriptor), while AMD has FET (Firmware Entry Table) at the highest level. The
PI specification further partiotions UEFI regions into [Firmware Volumes (FVs)](
https://edk2-docs.gitbook.io/edk-ii-minimum-platform-specification/appendix_a_full_maps/a1_firmware_volume_layout),
which can be compared to directories in common file systems like FAT. Similarly,
PSP and ME have their own formats again, hence different tools are needed.

> How can the behavior of the binaries be analyzed?

There are a few projects with a focus on binary analysis, such as [efiXplorer](
https://github.com/binarly-io/efiXplorer), an IDA plugin.

Static analysis is possible to a certain degree, given that UEFI images contain
many binary pieces. Especially dependencies in UEFI are [hard to evaluate](
https://sudonull.com/post/253-Static-analysis-BIOS-UEFI-or-how-to-get-Dependency-Graph).
For this reason, utk-web for now only prints out [DepEx declaration sections](
https://edk2-docs.gitbook.io/edk-ii-inf-specification/2_inf_overview/215_-depex-_section),
but you can select their GUIDs to see other occurences. Find more details in the 
[DepEx FAQ](https://github.com/tianocore/tianocore.github.io/wiki/Depex-FAQ).

> Can DXE drivers be analyzed at runtime?

Sort of.

- [https://github.com/gdbinit/efi_dxe_emulator](
https://github.com/gdbinit/efi_dxe_emulator)
- [https://github.com/assafcarlsbad/efi_dxe_emulator](
https://github.com/assafcarlsbad/efi_dxe_emulator)
- [https://labs.sentinelone.com/moving-from-manual-re-of-uefi-modules-to-dynamic-emulation-of-uefi-firmware/](
https://labs.sentinelone.com/moving-from-manual-re-of-uefi-modules-to-dynamic-emulation-of-uefi-firmware/)

> What is the maximum number of DXE drivers seen on a device in the wild?

AFAIK, close to 1k, nine-hundred-something.

## Features

- [x] display used firmware volumes (FVs) as sections
- [x] [uefi-firmware-parser](https://github.com/theopolis/uefi-firmware-parser)
      support
- [x] flattened UEFI sections
- [x] expand / shrink large sections
- [x] mark GUID, highlighted globally
- [x] mark any blob card (no further functionality yet)
- [x] display flash usage as reported by `fmap` (in a side panel)
- [x] visualize PSP images
  * sections ("directories") and entries
  * display indicators for properties like verified, signed, packed etc
  * mark blocks used by an entry when hovering its card
- [x] PSPTool support
- [x] MFT support

## TODO

- [ ] mark BootGuard protected regions
- [ ] load utk as in-browser back-end through WASM
- [ ] load fmap as in-browser back-end through WASM
- [ ] load mftcli as in-browser back-end through WASM
- [ ] load UEFITool CLI tools as in-browser back-end through WASM

## Development / Contribution

This project is based on the [Next.js](https://nextjs.org/) application
framework. It contains a few widgets (UI components) to render UEFI data
structures. If you would like to contribute, have ideas, etc, please feel free
to create issues [on GitHub](https://github.com/orangecms/utk-web/) and/or open
pull requests. Any form of contribution is highly appreciated. As this tool is
meant to be a GUI (by now :)), usability feedback is very important and welcome.
