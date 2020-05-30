import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Container } from 'semantic-ui-react'
import axios from 'axios'

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


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
    const { placeholder } = this.props
    return (
      <Container className="editor">
        <Editor
          apiKey="81jvj4ftt29hdio9oky5wnvlxtugicmawfi048fvjjf2dlg8"
          init={{
            placeholder: placeholder,
            plugins: ' emoticons placeholder  linkchecker link image imagetools autolink lists checklist quicklink blockquote powerpaste quickbars codesample hr autoresize',
            toolbar: ' emoticons quickimage codesample | link hr | bold italic underline | formatselect | bullist numlist checklist | undo redo ',
            toolbar_mode: 'floating',
            // images_upload_url: 'postAcceptor.php',
            // images_upload_base_path: '/some/basepath',
            images_upload_handler: async function (blobInfo, success, failure) {
              // console.log(blobInfo)
              console.log(blobInfo.blob())
              // console.log(blobInfo.filename())
              const headers = {
                "Content-type": 'undefined',
                'Authorization': `Token ${sessionStorage.getItem('token')}`,
              }
              let formData = new FormData()
              formData.append('image', blobInfo.blob(), blobInfo.filename())
              // formData.append('bug',)
              // formData.append('comment',)
              // formData.append('csrfmiddlewaretoken', getCookie("csrftoken"))
              const url = `http://localhost:8000/bug_reporter/images/`
              // let res = await fetch(url, { method: "POST", headers: headers, body: formData })
              let res = axios.post(url, formData, {
                headers: {
                  "Content-type": `multipart/form-data; boundary=${formData._boundary}`,
                  'Authorization': `Token ${sessionStorage.getItem('token')}`,
                  'Accept-Language': 'en-US,en;q=0.8',
                }
              })
              console.log(res)
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