import { Editor } from "@tinymce/tinymce-react"
import { Editor as TinyMCEEditor } from 'tinymce'
import { MutableRefObject } from "react"

interface RichTextEditorProps {
	editorRef: MutableRefObject<TinyMCEEditor | null>
	handleChange: (message: string) => void
	handleFileChange: (file: File) => void
	isSubmitting: boolean
}

const sanitizeContent = (content: string): string => {
	// Use a regex to remove <img> tags from the content
	return content.replace(/<img[^>]*>/g, "")
}

export default function RichTextEditor({ editorRef, handleChange, handleFileChange, isSubmitting }
	: RichTextEditorProps) {

	return (
		<Editor
			apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
			disabled={isSubmitting}
			onInit={(_evt, editor) => editorRef.current = editor}
			init={{
				height: 350,
				plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
				toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
				tinycomments_mode: 'embedded',
				content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
				file_picker_callback: (callback, value, meta) => {
					const input = document.createElement('input')
					input.setAttribute('type', 'file')
					input.setAttribute('accept', 'image/*') // or change to 'application/*' for other types

					input.onchange = () => {
						const file = input.files ? input.files[0] : null
						if (file) {
							const reader = new FileReader()
							reader.onload = (e) => {
								const id = 'blobid' + (new Date()).getTime()
								const blobCache = editorRef.current?.editorUpload.blobCache
								const base64 = (e.target?.result as string).split(',')[1]
								const blobInfo = blobCache?.create(id, file, base64)
								blobCache?.add(blobInfo!)

								// Call the callback to insert the file into the editor
								callback(blobInfo?.blobUri()!, { title: file.name })

								// Update the file state
								handleFileChange(file)
							}
							reader.readAsDataURL(file)
						}
					}
					input.click()
				}
			}}
			onEditorChange={() => handleChange(
				sanitizeContent(editorRef.current?.getContent() || ""))}
		/>
	)
}
