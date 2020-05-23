import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Container } from 'semantic-ui-react'

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
    const {placeholder} = this.props
    return (
      <Container className="editor">
        <Editor 
          apiKey="81jvj4ftt29hdio9oky5wnvlxtugicmawfi048fvjjf2dlg8"
          init={{
            placeholder:placeholder,
            plugins: 'a11ychecker emoticons placeholder advcode casechange formatpainter linkchecker autolink lists checklist media permanentpen powerpaste quickbars codesample table advtable autoresize',
            toolbar: ' emoticons quickimage formatselect bold italic underline casechange checklist table',
            toolbar_mode: 'floating',
            autoresize_bottom_margin: 0,
            autoresize_overflow_padding: 0,
            menubar: false,
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