import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import EditorPage from '../pages/editor'
function isGitUrl(str) {
    var regex = /^(?:git|ssh|https?|git@[-\w.]+):(\/\/)(github\.com)\/(\w{1,})\/(\w{1,})\/?$/;
    return regex.test(str);
};

class ProjectForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: {},
            values: { name: this.initialval()[0], githublink: this.initialval()[2] }
        }
        this.handleEditorChange = this.handleEditorChange.bind(this)
    }
    onChange = e => {
        const { name, value } = e.target
        let error
        if (name === "name") {
            value.length > 20 ? error = {
                content: "name can be between 0 and 20 characters",
                pointing: 'below'
            } : error = false
        }
        if (name === "githublink") {
            !isGitUrl(value) && value.length > 0 ? error = {
                content: "please provide valid github repo link",
                pointing: 'below'
            } : error = false
        }
        this.setState({
            values: { ...this.state.values, [name]: value },
            errors: { ...this.state.errors, [name]: error }
        })
    }
    handleEditorChange(content) {
        this.setState({
            values: { ...this.state.values, "wiki": content }
        })
    }
    onSubmitForm() {
        let data = this.state.values
        this.props.onSubmit(data)
    }
    initialval() {
        if (this.props.initialValues !== undefined) {
            return [this.props.initialValues.name, this.props.initialValues.wiki, this.props.initialValues.githublink]
        }
        else return ["", ""]
    }
    render() {
        return (
            <Form>
                <Form.Input required name='name' placeholder='name' label='name' value={this.state.values.name} onChange={this.onChange} />
                <EditorPage initialValue={this.initialval()[1]} onEditorChange={this.handleEditorChange} placeholder="Wiki" />
                <Form.Input error={this.state.errors.githublink} label="Git Link" name="githublink" onChange={this.onChange} value={this.state.values.githublink} />
                {this.props.isClose && <Button icon='cross' content='Cancel' onClick={this.props.onClose} />}
                <Button positive disabled={this.state.errors.name || this.state.errors.githublink || this.state.values.name.length === 0} type='submit' icon='checkmark' content={this.props.submitName} onClick={() => this.onSubmitForm()} />
            </Form>
        )
    }
}

class IssueForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeDomain: "f",
            errors: {},
            values: { name: this.initialval()[0] ,tags:"" }
        }
        this.handleEditorChange = this.handleEditorChange.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    async onChange(e) {
        const { name, value } = e.target
        let error
        if (name === "name") {
            value.length > 20 ? error = {
                content: "name can be between 0 and 20 characters",
                pointing: 'below'
            } : error = false
        }
        if (name === "tags" && !Boolean(this.props.tags)) {
            return
        }
        await this.setState({
            values: { ...this.state.values, [name]: value },
            errors: { ...this.state.errors, [name]: error }
        })
    }
    handleEditorChange(content) {
        this.setState({
            values: { ...this.state.values, "description": content }
        })
    }
    handleDomainClick = (name) => this.setState({ activeDomain: name })
    onSubmitForm() {
        let data = this.state.values
        if (this.props.tags) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            let regex = /^\w+$/
            let tags = this.state.values.tags.split(" ")
            tags = tags.filter(e => regex.test(e))
            tags = tags.filter(onlyUnique)
            data = { ...this.state.values, tags: tags }
        }
        if (this.props.isDomain) {
            data.domain = this.state.activeDomain
        }
        this.props.onSubmit(data)
    }
    initialval() {
        if (this.props.initialValues !== undefined) {
            return [this.props.initialValues.name, this.props.initialValues.description]
        }
        else return ["", ""]
    }
    render() {
        const { activeDomain } = this.state

        return (
            <Form>
                <Form.Input error={this.state.errors.name} label='Name' name='name' onChange={this.onChange} value={this.state.values.name} placeholder='Title' />
                <EditorPage initialValue={this.initialval()[1]} onEditorChange={this.handleEditorChange} placeholder="Descrpition" />
                {this.props.tags &&
                    <Form.Input onChange={this.onChange} name="tags" value={this.state.values.tags} label="Tags" placeholder="Use space for multiple tags" />
                }
                {this.props.isDomain &&
                    <Form.Field>
                        <Button.Group>
                            <Button content='Front End' basic={activeDomain !== "f"} onClick={() => { this.handleDomainClick("f") }} color='olive' />
                            <Button content='Back End' basic={activeDomain !== "b"} onClick={() => { this.handleDomainClick("b") }} color='blue' />
                            <Button content='Other' basic={activeDomain !== "o"} onClick={() => { this.handleDomainClick("o") }} color='purple' />
                        </Button.Group>
                    </Form.Field>
                }
                {this.props.isClose &&
                    <Button
                        content="cancel"
                        color="black"
                        onClick={() => { this.props.onClose() }}
                    />
                }
                <Button
                    positive
                    disabled={this.state.values.name.length === 0}
                    type='submit'
                    icon='checkmark'
                    content={this.props.submitName}
                    onClick={(event) => this.onSubmitForm()}
                />
            </Form>
        )
    }
}
export { isGitUrl, ProjectForm, IssueForm }