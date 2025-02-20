/*
Copyright (C) 2024-2025 by Mohanned Ahmed
Licensed under MIT license, see LICENSE.md for details
*/

define(["angular", "qlik", "jquery", "./utils", "./propertiesPanel", "text!./template.html", "css!./stylesheet.css"],
	function (angular, qlik, $, utils, propertiesPanel, template) {

		return {
			initialProperties: {
				props: {
					contentType: "currApp",
					buttonText: "Upload",
					readyButtonText: "Upload"
				},
				showTitles: false
			},
			template: template,
			definition: propertiesPanel,
			support: {
				snapshot: false,
				export: false,
				exportData: false
			},
			controller: ['$scope', function ($scope) {

				var $injector = angular.injector(['ng']);
				var $http = $injector.get("$http");
				var app;
				var requestURI;
				var currentAppId;
				var extensionObjectId;
				var uploadButtonId;
				var uploadButtonFileId;
				var uploadButtonLabelId;
				var uploadButtonChosenFileId;
				var uploadButtonChosenFile;
				var uploadButtonIconId;
				var uploadButtonWrapperId;
				var uploadButtonLabelWrapperId;
				var uploadButtonIconWrapperId;
				var uploadButtonContainerId;
				var uploadButtonIconImageId;
				var props;
				var readyButtonText;
				var buttonStatusStack = [];

				function StatusStackElement(status, priority, buttonText, buttonClass, buttonIconTypeClass, buttonRunning) {
					this.status = status
					this.priority = priority
					if (typeof buttonText === 'function') {
						this.buttonText = buttonText()
					}
					else {
						this.buttonText = buttonText
					}
					if (typeof buttonClass === 'function') {
						this.buttonClass = buttonClass()
					}
					else {
						this.buttonClass = buttonClass
					}
					this.buttonIconTypeClass = buttonIconTypeClass
					this.buttonRunning = buttonRunning
				}

				const buttonStatuses = [
					{
						status: 'ready',
						priority: 1,
						buttonText: function () {
							return readyButtonText
						},
						buttonClass: 'lui-button',
						buttonIconTypeClass: 'lui-icon lui-icon--upload',
						buttonRunning: false
					},
					{
						status: 'reloading',
						priority: 1,
						buttonText: 'Reloading',
						buttonClass: 'lui-button lui-button--info',
						buttonIconTypeClass: 'lui-icon lui-icon--sync',
						buttonRunning: true
					},
					{
						status: 'saving',
						priority: 1,
						buttonText: 'Saving',
						buttonClass: 'lui-button lui-button--info',
						buttonIconTypeClass: 'lui-icon lui-icon--sync',
						buttonRunning: true
					},
					{
						status: 'uploadError',
						priority: 1,
						buttonText: 'Upload failed',
						buttonClass: 'lui-button lui-button--danger',
						buttonIconTypeClass: 'lui-icon lui-icon--remove',
						buttonRunning: false
					},
					{
						status: 'error',
						priority: 1,
						buttonText: 'Reload failed',
						buttonClass: 'lui-button lui-button--danger',
						buttonIconTypeClass: 'lui-icon lui-icon--remove',
						buttonRunning: false
					},
					{
						status: 'success',
						priority: 2,
						buttonText: 'Reloaded & Saved',
						buttonClass: 'lui-button lui-button--success',
						buttonIconTypeClass: 'lui-icon lui-icon--tick',
						buttonRunning: false
					},
					{
						status: 'uploadSuccess',
						priority: 2,
						buttonText: 'Uploaded successfully',
						buttonClass: 'lui-button lui-button--success',
						buttonIconTypeClass: 'lui-icon lui-icon--tick',
						buttonRunning: false
					},
					{
						status: 'uploadStarted',
						priority: 1,
						buttonText: 'Uploading',
						buttonClass: 'lui-button lui-button--info',
						buttonIconTypeClass: 'lui-icon lui-icon--sync',
						buttonRunning: true
					},
					{
						status: 'waiting',
						priority: 1,
						buttonText: 'Waiting',
						buttonClass: 'lui-button lui-button--info',
						buttonIconTypeClass: 'lui-icon lui-icon--sync',
						buttonRunning: true
					}
				]

				var stackInterval = setInterval(rollStatus, 1000)

				function rollStatus() {

					if (buttonStatusStack.length > 0) {
						var status = buttonStatusStack.shift()
						$(uploadButtonLabelId).text(status.buttonText)
						$(uploadButtonId).attr('class', status.buttonClass);
						$(uploadButtonIconImageId).attr('class', status.buttonIconTypeClass)
						if (status.buttonRunning) {
							$(uploadButtonIconId).addClass("rotating")
						}
						else {
							$(uploadButtonIconId).removeClass("rotating")
						}
					}
				}

				function setButton(type) {
					var s = buttonStatuses.find(s => s.status === type);
					var status = new StatusStackElement(s.status, s.priority, s.buttonText, s.buttonClass, s.buttonIconTypeClass, s.buttonRunning)
					if (buttonStatusStack.length > 0) {
						if (JSON.stringify(status) !== JSON.stringify(buttonStatusStack[buttonStatusStack.length - 1])) {
							buttonStatusStack.push(status)
						}
					}
					else {
						buttonStatusStack.push(status)
					}
				}

				function init() {
					return new Promise((resolve) => {
						initDOMObjects().then(function () {
							props = $scope.layout.props
							requestURI = utils.getRequestURI()
							currentAppId = qlik.currApp().id 
							extensionObjectId = $scope.layout.qInfo.qId
							app = qlik.openApp(currentAppId)
							uploadButtonChosenFile = localStorage.getItem(`uploadButtonChosenFile-${extensionObjectId}`);
							if (uploadButtonChosenFile !== null)
								$(uploadButtonChosenFileId).text(uploadButtonChosenFile)
							app.getAppLayout(function (appLayout) {
								if (sessionStorage.getItem('lastReload') === null) {
									sessionStorage.setItem('lastReload', appLayout.qLastReloadTime)
								}
								else {
									var wasReloaded = sessionStorage.getItem('lastReload') < appLayout.qLastReloadTime
									if (wasReloaded && props.reloadApp) {
										// setButton("success")
										setButton("ready")
									}
								}
								sessionStorage.setItem('lastReload', appLayout.qLastReloadTime)
							})
							readyButtonText = props.readyButtonText
							$scope.$watch('layout.props.readyButtonText', function (newValue, oldValue) {
								if (newValue === oldValue) {
									return;
								}
								readyButtonText = props.readyButtonText
								setButton("ready")
							}, true);
							setButton("ready")
						})
						resolve();
					})
				}

				function initDOMObjects() {
					return new Promise((resolve) => {
						if (typeof (extensionObjectId) === 'undefined') {
							extensionObjectId = $scope.layout.qInfo.qId;
							uploadButtonId = '#upload-button-' + extensionObjectId;
							uploadButtonFileId = '#upload-button-file-' + extensionObjectId;
							uploadButtonLabelId = '#upload-button-label-' + extensionObjectId;
							uploadButtonChosenFileId = '#upload-button-file-chosen-' + extensionObjectId;
							uploadButtonIconId = '#upload-button-icon-' + extensionObjectId;
							uploadButtonIconImageId = '#upload-button-icon-img-' + extensionObjectId;
							uploadButtonWrapperId = '#upload-button-wrapper-' + extensionObjectId
							uploadButtonLabelWrapperId = '#upload-button-label-wrapper-' + extensionObjectId
							uploadButtonIconWrapperId = '#upload-button-icon-wrapper-' + extensionObjectId
							uploadButtonContainerId = '#upload-button-container-' + extensionObjectId
							maximizeButtonSelector = 'div[tid=' + extensionObjectId + '] a[tid=nav-menu-zoom-in]'
							$('#upload-button').attr('id', uploadButtonId.replace('#', ''));
							$('#upload-button-file').attr('id', uploadButtonFileId.replace('#', ''));
							$('#upload-button-label').attr('id', uploadButtonLabelId.replace('#', ''));
							$('#upload-button-file-chosen').attr('id', uploadButtonChosenFileId.replace('#', ''));
							$('#upload-button-icon').attr('id', uploadButtonIconId.replace('#', ''));
							$('#upload-button-icon-img').attr('id', uploadButtonIconImageId.replace('#', ''));
							$('#upload-button-wrapper').attr('id', uploadButtonWrapperId.replace('#', ''));
							$('#upload-button-label-wrapper').attr('id', uploadButtonLabelWrapperId.replace('#', ''));
							$('#upload-button-icon-wrapper').attr('id', uploadButtonIconWrapperId.replace('#', ''));
							$('#upload-button-container').attr('id', uploadButtonContainerId.replace('#', ''));
							$(maximizeButtonSelector).css('display', 'none');
						}
						resolve();
					})
				}

				function saveApp() {
					setButton('saving')
					app.doSave().then(function (response) {
						if (response) {
							setButton('success')
						}
						else {
							setButton('error')
						}
						setButton('ready')
					})
				}

				function uploadFile(contentId, fileName, fileContent, endpoint) {
					setButton('uploadStarted')
					utils.generateXrfkey().then(function (xrfkey) {
						$http({
							method: 'POST',
							url: requestURI + endpoint + contentId + `/uploadfile?&overwrite=true&externalpath=${fileName}&Xrfkey=${xrfkey}`,
							data: fileContent,
							transformRequest: angular.identity,
							headers: { 'X-Qlik-Xrfkey': xrfkey, 'Content-Type': 'application/json'}
						}).then(function (response) {
							generatedTaskId = $scope.generatedTaskId = response.data.value;
							setButton('uploadSuccess')
							$(uploadButtonChosenFileId).text(fileName);
							localStorage.setItem(`uploadButtonChosenFile-${extensionObjectId}`, fileName);
							setButton('ready')
							if(props.reloadApp) {
								app.doReload().then(function (response) {
									if (response) {
										saveApp()
									}
									else {
										setButton("error")
									}
								})
							}
						})
					})
				}


				function uploadFileToAppContent(fileName, fileContent) {
					uploadFile(currentAppId, fileName, fileContent, '/qrs/appcontent/')
				}

				function uploadFileToContentLibrary(file) {
    					if (!file) {
        					console.error("No file selected.");
        					return;
    					}

    					let formData = new FormData();
    					formData.append("file", file, "proyeccion editada.xlsx"); // Ensure correct filename
    					formData.append("folder", "extraccion (vivibooki7erk_asus)"); // Ensure correct folder

    					fetch("/qrs/contentlibrary/uploadfile", {
        					method: "POST",
        					headers: {
            					"X-Qlik-Xrfkey": "1234567890abcdef", // Adjust if necessary
            					"Content-Type": "multipart/form-data"
        					},
        					body: formData
    					})
    					.then(response => {
        					if (!response.ok) {
            					throw new Error("Upload failed");
        					}
        					return response.json();
    					})
    					.then(data => {
        					console.log("File uploaded successfully:", data);
    					})
    					.catch(error => {
        					console.error("Error uploading file:", error);
    					});
				}
				

				init().then(function () {
					$(uploadButtonId).on('click', function (event) {
						event.preventDefault();
						$(uploadButtonFileId).trigger('click');
					})					
					$(uploadButtonFileId).on('change', function (event) {
						let file = event.target.files[0];
						if (file) {
							let reader = new FileReader();
							reader.onload = function() {
								switch (props.contentType) {
									case "currApp":
										uploadFileToAppContent(file.name, reader.result)
										break
									case "contentLibrary":
										uploadFileToContentLibrary(props.contentLibraryId, file.name, reader.result)
										break
								}
							};
							reader.readAsArrayBuffer(file);
						}



					})
				});
			}],

			paint: function ($element, layout) {
				var extensionObjectId = layout.qInfo.qId;
				var uploadButtonId = '#upload-button-' + extensionObjectId
				var uploadButtonWrapperId = '#upload-button-wrapper-' + extensionObjectId
				var uploadButtonLabelWrapperId = '#upload-button-label-wrapper-' + extensionObjectId
				var uploadButtonIconWrapperId = '#upload-button-icon-wrapper-' + extensionObjectId
				var uploadButtonIconId = '#upload-button-icon-' + extensionObjectId
				var uploadButtonContainerId = '#upload-button-container-' + extensionObjectId;
				var buttonSize = $(uploadButtonId).width()
				if (buttonSize < 230) {
					$(uploadButtonWrapperId).removeClass('upload-button-wrapper')
					$(uploadButtonLabelWrapperId).addClass('upload-button-label-wrapper-text-hidden')
					$(uploadButtonIconWrapperId).removeClass('upload-button-icon-wrapper')
					$(uploadButtonIconId).addClass('upload-button-icon-text-hidden')
					$(uploadButtonContainerId).removeClass('upload-button-container')
					$(uploadButtonContainerId).addClass('upload-button-container-block')
				}
				else {
					$(uploadButtonWrapperId).addClass('upload-button-wrapper')
					$(uploadButtonLabelWrapperId).removeClass('upload-button-label-wrapper-text-hidden')
					$(uploadButtonIconWrapperId).addClass('upload-button-icon-wrapper')
					$(uploadButtonIconId).removeClass('upload-button-icon-text-hidden')
					$(uploadButtonContainerId).addClass('upload-button-container')
					$(uploadButtonContainerId).removeClass('upload-button-container-block')
				}
				return qlik.Promise.resolve();
			}
		};
	});
