import React from 'react'
import { Placeholder, Segment } from 'semantic-ui-react'

const NormalPlaceholder = () => (
    <Segment raised>
        <Placeholder fluid>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>
    </Segment>
)

const BigPlaceholder = () => (
    <Segment>
        <Placeholder fluid>
            <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
        </Placeholder>
    </Segment>
)
export { NormalPlaceholder, BigPlaceholder }