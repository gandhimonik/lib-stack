import React, {Component} from 'react';
import { Form } from 'semantic-ui-react';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.query || '',
            isLite: props.isLite,
        };
        this.searchInput = React.createRef();
    }

    onChange = e => {
        this.setState({
            query: e.target.value,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            query: nextProps.query || '',
        });
    }

    componentDidMount() {
        if (this.searchInput && this.searchInput.current) {
            this.searchInput.current.focus();
        }
    }

    render() {
        return (
            <Form onSubmit={e => this.props.onSubmit(e, this.state.query)}>
                {this.state.isLite &&
                    <Form.Input
                        name="query"
                        className="search wrapper"
                        icon="search"
                        placeholder="Search Libraries..."
                        value={this.state.query}
                        onChange={this.onChange}
                    />
                }

                {!this.state.isLite &&
                    <Form.Group>
                        <Form.Input
                            width={13}
                            size="big"
                            name="query"
                            value={this.state.query}
                            onChange={this.onChange}
                            placeholder="Search..."
                            style={{margin: '1em 0'}}
                            input={{ref: this.searchInput}}
                        />
                        <Form.Button
                            fluid
                            width={3}
                            size="big"
                            color="orange"
                            type="submit"
                            style={{fontWeight: 400, margin: '1em 0'}}>
                            Search
                        </Form.Button>
                    </Form.Group>
                }

            </Form>
        );
    }
}

export default SearchForm;
