import React from 'react';
import {fireEvent, render, screen} from '../../tests/test-utils';
import {StructureTab} from '../StructureTab';
import {PROPERTY_NAMES, Structure} from '../../models';
import {initialGenerator} from '../../tests/fixtures/initialGenerator';

jest.mock('../structure/AddPropertyButton');
jest.mock('../structure/DelimiterEdit');

describe('StructureTab', () => {
  it('should render the structure tab', () => {
    const structure: Structure = [
      {
        type: PROPERTY_NAMES.FREE_TEXT,
        string: 'AKN',
      },
      {
        type: PROPERTY_NAMES.AUTO_NUMBER,
        digitsMin: 10,
        numberMin: 42,
      },
    ];
    render(<StructureTab initialStructure={structure} delimiter={'--'} onStructureChange={jest.fn()} />);
    expect(screen.getByText('pim_identifier_generator.structure.title')).toBeInTheDocument();
    expect(screen.getByText('AddPropertyButtonMock')).toBeInTheDocument();
    expect(screen.getByText('DelimiterEditMock')).toBeInTheDocument();
    expect(screen.getAllByText('AKN')).toHaveLength(2);
  });

  it('should add a new property', () => {
    const onStructureChange = jest.fn();
    render(<StructureTab initialStructure={[]} delimiter={null} onStructureChange={onStructureChange} />);

    expect(screen.getByText('AddPropertyButtonMock')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add Property'));
    expect(onStructureChange).toBeCalledWith(expect.any(Array));
  });

  it('should update a property', () => {
    const onStructureChange = jest.fn();
    render(
      <StructureTab
        initialStructure={[
          {
            type: PROPERTY_NAMES.FREE_TEXT,
            string: 'original value',
          },
        ]}
        initialDelimiter={null}
        onStructureChange={onStructureChange}
      />
    );

    expect(screen.getAllByText('original value')).toHaveLength(2); // Preview + Line
    fireEvent.click(screen.getAllByText('original value')[1]);
    expect(screen.getByText('pim_identifier_generator.structure.settings.free_text.title')).toBeInTheDocument();
    expect(screen.getByTitle('original value')).toBeInTheDocument();
    fireEvent.change(screen.getByTitle('original value'), {target: {value: 'updated value'}});
    expect(onStructureChange).toBeCalledWith(expect.any(Array));
  });

  it('should delete a property', () => {
    const onStructureChange = jest.fn();
    render(
      <StructureTab
        initialStructure={initialGenerator.structure}
        initialDelimiter={null}
        onStructureChange={onStructureChange}
      />
    );

    fireEvent.click(screen.getByText('pim_common.delete'));
    expect(screen.getByText('pim_identifier_generator.list.confirmation')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('pim_common.delete')[1]);
    expect(onStructureChange).toBeCalledWith([]);
  });

  it('should cancel deletion of a property', () => {
    const onStructureChange = jest.fn();
    render(
      <StructureTab
        initialStructure={[
          {
            type: PROPERTY_NAMES.FREE_TEXT,
            string: 'original value',
          },
        ]}
        delimiter={null}
        onStructureChange={onStructureChange}
      />
    );

    fireEvent.click(screen.getByText('pim_common.delete'));
    expect(screen.getByText('pim_identifier_generator.list.confirmation')).toBeInTheDocument();
    fireEvent.click(screen.getByText('pim_common.cancel'));
    expect(screen.queryByText('pim_identifier_generator.list.confirmation')).not.toBeInTheDocument();
  });

  it('should toggle off the delimiter', () => {
    const onStructureChange = jest.fn();
    const onDelimiterChange = jest.fn();
    render(
      <StructureTab
        initialStructure={[
          {
            type: PROPERTY_NAMES.FREE_TEXT,
            string: 'original value',
          },
        ]}
        delimiter={'--'}
        onStructureChange={onStructureChange}
        onDelimiterChange={onDelimiterChange}
      />
    );

    expect(screen.getByTestId('current_delimiter').textContent).toEqual('--');
    expect(screen.getByText('Toggle Delimiter')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Toggle Delimiter'));
    expect(onDelimiterChange).toBeCalledWith(null);
  });

  it('should toggle on the delimiter', () => {
    const onStructureChange = jest.fn();
    const onDelimiterChange = jest.fn();
    render(
      <StructureTab
        initialStructure={[
          {
            type: PROPERTY_NAMES.FREE_TEXT,
            string: 'original value',
          },
        ]}
        delimiter={null}
        onStructureChange={onStructureChange}
        onDelimiterChange={onDelimiterChange}
      />
    );

    expect(screen.getByTestId('current_delimiter').textContent).toEqual('');
    expect(screen.getByText('Toggle Delimiter')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Toggle Delimiter'));
    expect(onDelimiterChange).toBeCalledWith('-');
  });

  it('should not display add property button when limit is reached', () => {
    render(
      <StructureTab
        initialStructure={[
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
          {type: PROPERTY_NAMES.FREE_TEXT, string: 'abc'},
        ]}
        delimiter={null}
        onStructureChange={jest.fn()}
      />
    );
    expect(screen.queryByText('AddPropertyButtonMock')).not.toBeInTheDocument();
    expect(screen.getByText('pim_identifier_generator.structure.limit_reached')).toBeInTheDocument();
  });
});
