import React, { FC } from 'react';
import PropTypes from 'prop-types';

interface ILogoProps {
	width?: number;
	height?: number;
	alt?: string;
}

const Logo: FC<ILogoProps> = ({ width, height,alt  }) => {
	return (
		<img
			src={'/images/logo2.png'}
			alt="Logo"
			width={width}
			height={height}
			style={{ objectFit: 'contain' }}
		/>
	);
};

Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};



export default Logo;
