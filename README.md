# Qlik Sense Extension for File Upload 
<p align="center">
  <img src="src/icon.png" alt="Icon" />
</p>
Qlik Sense Extension for uploading files to app content/attached files and content libraries.

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
* **Automatic App Reload**: Provides an option to automatically reload the app upon successful file upload. This feature ensures that the new files are immediately available for use without manual intervention.

## Installation

1. Download archive `QSExtFileUpload.zip` from [dist](https://github.com/MohannedA/Qlik-Sense-File-Upload-Extension/tree/main/dist) folder.
2. Go to Qlik's QMC.
3. Navigate to Extensions section.
4. Click import button.
5. Choose archive `QSExtFileUpload.zip`.

## Usage & Configuration
1. Drag & drop the extension into Qlik Sense's sheet.
2. Select content type (where the file is going to be stored): app content/attached files (e.g., `Current App`) or content library (e.g., `Selected Content Library`). 
3. Select whether the app should be reloaded after reload (e.g., `Reload app after upload`).
4. Customize the button label if needed. 

![Screenshot](screenshot.png)

## Important Note
Users can only upload through this extension if they are allowed as per their licenses and the related security rules.  

## TODOs
- [ ] Implment a checkbox to hide selected file label. 

## License
[MIT](https://choosealicense.com/licenses/mit/)