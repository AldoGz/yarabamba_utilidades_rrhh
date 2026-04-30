import React from 'react';
import { IMaskInput } from 'react-imask';

export interface TextMaskCustomProps {
    onChange: (event: { target: { name?: string; value: any } }) => void;
    name?: string;
    mask: any;
    [key: string]: any;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, TextMaskCustomProps>(function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask={mask}
            definitions={{
                '0': /[0-9]/,
            }}
            inputRef={ref}
            onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

TextMaskCustom.displayName = 'TextMaskCustom';

export default TextMaskCustom;
