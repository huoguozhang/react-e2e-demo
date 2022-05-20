import React from 'react';
import Enzyme, { mount, shallow, render } from 'enzyme';
import MultiCheck, { CheckboxWrap } from './MultiCheck';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

async function sleep(t = 0) {
  return new Promise((r) => setTimeout(r, t, 'ok'));
}

const SELECT_LABEL = '.component-label';
const CHECKBOX_WRAPPER = '.checkbox-wrapper';
const SELECT_ALL = '.select-all';
describe('MultiCheck', () => {
  const options = [
    {
      label: '男',
      value: 'male',
    },
    {
      label: '女',
      value: 'female',
    },
  ];
  describe('initialize', () => {
    const wrapper = mount(<MultiCheck label="my label" options={options} />);

    it('basic feature, renders element', () => {
      expect(wrapper.find(SELECT_LABEL).text()).toBe('my label');
      expect(wrapper.find(SELECT_ALL).length).toBe(1);
      const checkboxGroup = wrapper.find(CHECKBOX_WRAPPER);
      expect(checkboxGroup.length).toBe(2);
      checkboxGroup.forEach((node, i) => {
        expect(node.text()).toBe(options[i].label);
        expect(node.name()).toBe('div');
        expect(node.find('input').props()['type']).toBe('checkbox');
        expect(node.find('input').props()['value']).toBe(options[i].value);
      });
    });
  });

  describe('props init and update', () => {
    const values: string[] = [];
    const fn: any = jest.fn(() => {});

    const wrapper = mount(
      <MultiCheck onChange={fn} values={values} columns={2} options={options} />
    );

    it('label', async () => {
      expect(wrapper.find(SELECT_LABEL).exists()).toBeFalsy();
      wrapper.setProps({
        label: 'hello world',
      });
      expect(wrapper.find(SELECT_LABEL).text()).toBe('hello world');
    });

    it('values', async () => {
      const checkboxGroup = wrapper.find(CHECKBOX_WRAPPER);
      checkboxGroup.forEach((node) => {
        expect(node.find('input').prop('checked')).toBeFalsy();
      });

      wrapper.setProps({
        values: ['male'],
      });

      [
        [0, true],
        [1, false],
      ].forEach((v) => {
        const [i, boo] = v;
        expect(
          (
            wrapper
              .find(CHECKBOX_WRAPPER)
              .at(i as number)
              .find('input')
              .getDOMNode() as any
          ).checked
        ).toBe(boo);
      });
    });

    it('columns', () => {
      expect(wrapper.find('.column-wrapper').length).toBe(2);
      wrapper.setProps({
        columns: 3,
      });
      expect(wrapper.find('.column-wrapper').length).toBe(3);
    });

    it('on change', () => {
      const checkGroup = wrapper.find(CHECKBOX_WRAPPER);
      checkGroup.forEach((node) => {
        const input = node.find('input');
        input.simulate('change', {
          target: input.getDOMNode(),
        });
      });

      expect(fn.mock.calls.length).toBe(2);
    });

    it('options', () => {
      wrapper.setProps({
        options: options.concat([
          {
            label: 'x',
            value: 'x',
          },
        ]),
      });

      const checkboxGroup = wrapper.find(CHECKBOX_WRAPPER);
      expect(checkboxGroup.length).toBe(3);
    });
  });

  describe('all select', () => {
    const wrapper = mount(<MultiCheck label="my label" options={options} />);

    it('select checkbox click', () => {
      wrapper.find(CHECKBOX_WRAPPER).forEach((node) => {
        expect(node.find('input').prop('checked')).toBeFalsy();
      });

      const select_all_label = wrapper.find(SELECT_ALL).find('input');

      // checked
      select_all_label.simulate('change', {
        target: select_all_label.getDOMNode(),
      });

      wrapper.find(CHECKBOX_WRAPPER).forEach((node) => {
        expect((node.find('input').getDOMNode() as any).checked).toBeTruthy();
      });

      // unchecked
      select_all_label.simulate('change', {
        target: select_all_label.getDOMNode(),
      });

      wrapper.find(CHECKBOX_WRAPPER).forEach((node) => {
        expect((node.find('input').getDOMNode() as any).checked).toBeFalsy();
      });
    });

    it('all item checkbox change, select all change', () => {
      wrapper.find(CHECKBOX_WRAPPER).forEach((node) => {
        const input = node.find('input');
        input.simulate('change', {
          target: input.getDOMNode(),
        });
      });

      wrapper.find(CHECKBOX_WRAPPER).forEach((node) => {
        expect((node.find('input').getDOMNode() as any).checked).toBeTruthy();
      });

      function testSelectAllLabel(b: boolean) {
        expect(wrapper.find(SELECT_ALL).find('input').prop('checked')).toBe(b);
      }

      testSelectAllLabel(true);

      const first = wrapper.find(CHECKBOX_WRAPPER).at(0).find('input');

      first.simulate('change', {
        target: first.getDOMNode(),
      });

      testSelectAllLabel(false);

      first.simulate('change', {
        target: first.getDOMNode(),
      });

      testSelectAllLabel(true);
    });
  });
});
