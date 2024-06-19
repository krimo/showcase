var PXBoxFileUpload = (function () {
	'use strict';

	function init() {
		if ($('.mod--box_file_upload').length === 0) return;

		Dropzone.autoDiscover = false;

		var box = new BoxSdk();
		var boxClient = new box.PersistentBoxClient({
			accessTokenHandler: function (cb) {
				$.ajax({
					url: '/wp-json/box/token',
					method: 'POST',
				}).done(function (data) {
					cb(null, data);
				});
			},
			isCallback: true,
		});

		$('.mod--box_file_upload').each(function (fileUploadModule) {
			var $progressBar = $(this).find('.mod--box_file_upload__progress');
			var $responseBox = $(this).find('.form-response');
			var $submitButton = $(this).find('button[type="submit"]');
			var $uploadForm = $(this).find('.file-upload-form');
			var destinationFolderID = $(this).data('destinationFolder');
			var myDropzone = new Dropzone($uploadForm[0], {
				url: '/wp-json/box/upload',
				maxFilesize: 256,
				maxFiles: 1,
				timeout: 180000,
				autoProcessQueue: false,
				init: function () {
					this.on('addedfile', function (file) {
						if (this.files.length > 1) this.removeFile(file);
					});
				},
				renameFile: function (f) {
					var timestamp = new Date().getTime();
					var filenameParts = f.name.split('.');
					return filenameParts.length === 2
						? filenameParts[0] + '_' + timestamp + '.' + filenameParts[1]
						: timestamp + '_' + filenameParts[0];
				},
			});

			$submitButton.on('click', function (ev) {
				$uploadForm.addClass('processing');
				$submitButton.attr('disabled', true);

				var queuedFiles = myDropzone.files;
				var timestamp = new Date().getTime();

				var maxFileSize = (
					queuedFiles
						.map(function (el) {
							return el.size;
						})
						.reduce(function (a, b) {
							return Math.max(a, b);
						}) / Math.pow(1024, 2)
				).toFixed(2);

				if (maxFileSize <= 50) {
					var formData = new FormData();
					var f = queuedFiles[0];
					var filenameParts = f.name.split('.');
					var filename =
						filenameParts.length === 2
							? filenameParts[0] + '_' + timestamp + '.' + filenameParts[1]
							: timestamp + '_' + filenameParts[0];

					formData.append(filename, f, filename);
					formData.append('parent_id', destinationFolderID);

					boxClient.files
						.upload({
							body: formData,
						})
						.then(function (data) {
							$uploadForm.removeClass('processing');
							$submitButton.attr('disabled', false);
							$responseBox.append('<p class="success">' + data.entries[0].name + ' was successfully uploaded.</p>');
						})
						.catch(function (err) {
							$uploadForm.removeClass('processing');
							$responseBox.append('<p class="error">Error: ' + err.message + '</p>');
						});
				} else {
					var reader = new FileReader();
					reader.onload = function (ev) {
						var fileSha1ArrayBuffer = sha1.arrayBuffer(ev.target.result);
						var filenameParts = queuedFiles[0].name.split('.');
						var filename =
							filenameParts.length === 2
								? filenameParts[0] + '_' + timestamp + '.' + filenameParts[1]
								: timestamp + '_' + filenameParts[0];

						boxClient.files
							.chunkedUpload({
								file: queuedFiles[0],
								name: filename,
								parentFolder: { id: '' + destinationFolderID },
								fileSHA1ArrayBuffer: fileSha1ArrayBuffer,
								listeners: {
									handleProgressUpdates: function (e) {
										console.log('Progress captured...');
										console.log('Percentage processed: ');
										console.log(e.detail.progress.percentageProcessed);
										console.log('Percentage uploaded: ');
										console.log(e.detail.progress.percentageUploaded);
										var htmlResponse = '';
										if (e.detail.progress.percentageProcessed < 1) {
											htmlResponse +=
												'<p>Percentage processed: ' +
												parseInt(parseFloat(e.detail.progress.percentageProcessed) * 100) +
												'%</p>';
										}
										if (e.detail.progress.percentageUploaded > 0) {
											htmlResponse +=
												'<p>Percentage uploaded: ' +
												parseInt(parseFloat(e.detail.progress.percentageUploaded) * 100) +
												'%</p>';
										}
										$progressBar.val(e.detail.progress.percentageUploaded);
										$responseBox.html(htmlResponse);
									},
									// Starting event fired after cancelling work is complete
									getIsCancellingNotification: function (e) {
										console.log('Started cancelling!');
										console.log(e.detail.progress);
									},
									// Finish event fired after cancelling work is complete
									getIsCancelledNotification: function (e) {
										console.log('Finished cancelling!');
										console.log(e.detail.progress);
									},
									// Register a listener for a failure event
									getFailureNotification: function (e) {
										console.log('Failed!');
										console.log(e.detail.progress.didFail);
									},
									// Register a listener for a success event
									getSuccessNotification: function (e) {
										console.log('Success!');
										console.log(e.detail.progress.didSucceed);
									},
									// Register a listener for when the upload process starts
									getStartNotification: function (e) {
										console.log('Upload started!');
										console.log(e.detail.progress.didStart);
									},
									// Register a listener for when a commit has a retry needed
									getFileCommitRetryNotification: function (e) {
										console.log('File commit retry needed!');
									},
									// Register a listener for when all parts are uploaded and the entire file is committed to Box
									getFileCommitNotification: function (e) {
										console.log('File committed!');
										console.log(e.detail.progress.didFileCommit);
									},
									// Register a listener for the completion event -- with either a success or failure outcome
									getCompletedNotification: function (e) {
										console.log('Upload completed!');
										console.log(e.detail.progress.isComplete);
										$uploadForm.removeClass('processing');
										$submitButton.attr('disabled', false);
									},
								},
							})
							.then(function (fileCollection) {
								$responseBox.append(
									'<p class="success">' + fileCollection.data.entries[0].name + ' was successfully uploaded.</p>'
								);
							})
							.catch(function (err) {
								console.log(err);
								$responseBox.append('<p class="error">Error uploading the file, check the console.</p>');
							});
					};
					reader.readAsArrayBuffer(queuedFiles[0]);
				}
			});
		});
	}

	return {
		init: init,
	};
})();
