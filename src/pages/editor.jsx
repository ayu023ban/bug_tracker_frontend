import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Container } from 'semantic-ui-react'
import axios from 'axios'
import {image_url} from '../routes'


class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = { editor: null };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }
  handleEditorChange = (content, editor) => {
    this.props.onEditorChange(content)
  }

  render() {
    const { placeholder ,bug,comment } = this.props
    return (
      <Container className="editor">
        <Editor
          apiKey="81jvj4ftt29hdio9oky5wnvlxtugicmawfi048fvjjf2dlg8"
          initialValue={this.props.initialValue}
          init={{
            placeholder: placeholder,
            plugins: ' emoticons placeholder  linkchecker link image imagetools autolink lists checklist quicklink powerpaste quickbars blockquote codesample hr autoresize',
            toolbar: ' emoticons blockquote quickimage codesample | link hr | bold italic underline | formatselect | bullist numlist checklist | undo redo ',
            toolbar_mode: 'floating',
            images_upload_handler: async function (blobInfo, success, failure) {
              let formData = new FormData()
              formData.append('image', blobInfo.blob(), blobInfo.filename())
              if(bug !== null && bug !== undefined){
                formData.append('bug',bug)
              }
              if(comment !== null && comment !== undefined){
                formData.append('comment',comment)
              }
              let res = await axios.post(image_url, formData, {
                headers: {
                  "Content-type": `multipart/form-data; boundary=${formData._boundary}`,
                  'Authorization': `Token ${sessionStorage.getItem('token')}`,
                  'Accept-Language': 'en-US,en;q=0.8',
                }
              })
              // let data = await res
              success(res.data.image)
              // console.log(res)
            },
            autoresize_bottom_margin: 0,
            autoresize_overflow_padding: 0,
            menubar: false,
            default_link_target: "_blank",
            quickbars_insert_toolbar: 'emoticons quickimage hr pagebreak codesample',
            quickbars_selection_toolbar: 'bold italic underline | formatselect | quicklink blockquote',
            contextmenu: 'undo redo ',
            powerpaste_word_import: 'clean',
            powerpaste_html_import: 'clean',
            content_css: '//www.tiny.cloud/css/codepen.min.css',
            statusbar: false,
          }}
          onEditorChange={this.handleEditorChange}
        />
      </Container>
    );
  }
}


export default EditorPage