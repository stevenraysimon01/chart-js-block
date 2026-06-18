/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

// Components
import { InspectorControls } from '@wordpress/block-editor';
import { Panel, PanelBody, TextControl, SelectControl, Button, ColorPicker, FormToggle } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Import ChartJs components
// npm install --save chart.js react-chartjs-2
import Chart from 'chart.js/auto';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props] Properties passed from the editor.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
  const { title, type, data, labels, colors, border } = props.attributes;

  if (title != null) {
    wp.data.dispatch('core/editor').unlockPostSaving('requiredValueLock');
  } else {
    wp.data.dispatch('core/editor').lockPostSaving('requiredValueLock');
  }

  function updateAttributeArray(attributeName, text, index = null) {
    const updatedArray = [...props.attributes[attributeName]];

    if (index !== null) {
      updatedArray[index] = text;
    } else {
      updatedArray.push(text);
    }

    props.setAttributes({ [attributeName]: updatedArray });
  }

  function removeAttributeArray(attributeName, text, index = null) {
    const updatedArray = [...props.attributes[attributeName]];

	  updatedArray.pop();

	  props.setAttributes({ [attributeName]: updatedArray });
  }

  const updateTitle = (content) => {
    props.setAttributes({ title: content });
  };

  const setChart = (content) => {
    props.setAttributes({ type: content });
  };

  const updateBorder = () => {
    setBorder((prevShowBorder) => !prevShowBorder);
    props.setAttributes({ border: !showBorder });
  };

  const [showBorder, setBorder] = useState(border);

  const renderTextControls = (attributeName, label, placeholder) => {
    return props.attributes[attributeName].map((item, i) => (
      <TextControl
        key={i}
        id={`${attributeName}-item-${i}`}
        label={label.replace('{i}', i + 1)}
        placeholder={placeholder.replace('{i}', i + 1)}
        value={item}
        onChange={(content) => updateAttributeArray(attributeName, content, i)}
      />
    ));
  };

  const renderChart = () => {
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: title,
          data: data,
          backgroundColor: colors,
          borderColor: '#777',
          borderWidth: border,
        },
      ],
    };

    if (type === 'line') return <Line data={chartData} />;
    if (type === 'bar') return <Bar data={chartData} />;
    if (type === 'doughnut') return <Doughnut data={chartData} />;
    if (type === 'pie') return <Pie data={chartData} />;
    return null;
  };

  return (
    <div>
      <InspectorControls>
        <Panel>
          <PanelBody icon="button-link" title={__('Chart Title and Type', 'button-link')} initialOpen={true}>
            <TextControl
              id="title"
              label="Title"
              placeholder={__('Title', 'create-block_')}
              value={title}
              onChange={(content) => updateTitle(content)}
            />
            <SelectControl
              label="Type"
              value={type}
              options={[
                { label: 'Line', value: 'line' },
                { label: 'Bar', value: 'bar' },
                { label: 'Doughnut', value: 'doughnut' },
                { label: 'Pie', value: 'pie' },
              ]}
              onChange={(content) => setChart(content)}
            />
          </PanelBody>
          <PanelBody icon="button-link" title={__('Chart Data', 'button-link')} initialOpen={false}>
            {renderTextControls('data', __("Data Item {i}"), __("Item {i}"))}
            <Button onClick={() => removeAttributeArray('data', '')}>Delete</Button>
            <Button onClick={() => updateAttributeArray('data', '')}>Add</Button>
          </PanelBody>
          <PanelBody icon="button-link" title={__('Chart Labels', 'button-link')} initialOpen={false}>
            {renderTextControls('labels', __("Label {i}"), __("Label {i}"))}
            <Button onClick={() => removeAttributeArray('labels', '')}>Delete</Button>
            <Button onClick={() => updateAttributeArray('labels', '')}>Add</Button>
          </PanelBody>
          <PanelBody icon="button-link" title={__('Chart Colors', 'button-link')} initialOpen={false}>
            <FormToggle checked={showBorder} onChange={updateBorder} />
            <p>Show Border</p>
            <br />
            {colors.map((item, i) => (
              <ColorPicker
                key={i}
                id={`color-item-${i}`}
                label={__("Color {i}").replace('{i}', i + 1)}
                color={item}
                onChange={(content) => updateAttributeArray('colors', content, i)}
              />
            ))}
            <Button onClick={() => removeAttributeArray('colors', '')}>Delete</Button>
            <Button onClick={() => updateAttributeArray('colors', '')}>Add</Button>
          </PanelBody>
        </Panel>
      </InspectorControls>
      <div className="chart">{renderChart()}</div>
    </div>
  );
}
