# Qlik Sense Extension for File Upload 
<p align="center">
  <img src="src/icon.png" alt="Icon" />
</p>
Qlik Sense extension for uploading files to app content/attached files and content libraries.

## Features
### Easy-to-Use
* **Minimal Configuration**: Set up the extension with minimal effort. It’s designed to work out-of-the-box with default settings, making it easy to integrate into your Qlik Sense environment.

### Customizable Design
* **Qlik's UI Design Principles**: Adopts Qlik’s Leonardo UI design principles, ensuring consistency with other Qlik Sense elements.
* **Customizable Styles**: Leverages uniquely identified components, such as specific class names and IDs, to allow for easy customization and styling. Adjust the appearance through CSS to fit your brand's look and feel.

### Multi-Option Upload
* **App Content Upload**: Upload files directly to the app content, allowing integration with specific Qlik Sense applications.

* **Content Library Upload**: Alternatively, upload files to content libraries for broader accessibility across different apps and use cases.

**Auto Reload After Upload**
* **Automatic App Reload**: Provides an option to automatically reload the app upon successful file upload. This feature ensures that the new files are immediately availabel for use without manual intervention.

## Installation

1. Download archive `QSExtFileUpload.zip` from [dist](https://github.com/MohannedA/Qlik-Sense-File-Upload-Extension/tree/main/dist) folder.
2. Go to Qlik's QMC.
3. Navigate to Extensions section.
4. Click import button.
5. Choose archive `QSExtFileUpload.zip`.

## Security Rules & Licenses Configration
In order for the extension to work properly with end-users, the following security rules and license type should be considered for each of the options: uploading to app content and uploading to a content library, and reloading the app after upload. 
### Uploading to App Content
|  |  |
|------------------|---------------|
| **License Type** |Professional   |
| **Resource**     | App          |
| **Actions**      | Read, Update  |

### Uploading to Content Library
|  |  |
|------------------|---------------|
| **License Type** |Professional   |
| **Resource**     | Content Library          |
| **Actions**      | Read, Update  |

### Reloading App After Upload
|  |  |
|------------------|---------------|
| **License Type** |Professional   |
| **Resource**     | App          |
| **Actions**      | Read, Update  |

**Note**: These are not precisely defined security rules for QS, but rather the necessary requirements that must be met for the extension to function correctly with the specified options.

## Appearance Customization
Button label can be customized through `Appearance` section in properties.Other customization can be done through CSS by using class-based and id-based selectors (e.g., `upload-button-container`, `upload-button-wrapper`, etc.).  

## Usage
1. Drag & drop the extension into Qlik Sense's sheet.
2. Select content type (where the file is going to be stored): app content/attached files (e.g., `Current App`) or content library (e.g., `Selected Content Library`). 
3. Select whether the app should be reloaded after reload (e.g., `Reload app after upload`).
4. Users can now upload files.

![Screenshot](screenshot.png)

## Important Note
Users can only upload through this extension if they are allowed as per their licenses and the related security rules.  

## TODOs
- [ ] Implment a checkbox to hide selected file label. 
- [ ] Implement a clint-side allowed max file size. 
- [ ] Implement a clint-side whitelist of allowed file extensions. 
## License
[MIT](https://choosealicense.com/licenses/mit/)