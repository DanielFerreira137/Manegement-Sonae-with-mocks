import React, { Children, cloneElement, FC, HTMLAttributes, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { randomColor } from '../helpers/helpers';
import Popovers from './bootstrap/Popovers';
import useDarkMode from '../hooks/useDarkMode';
import { TColor } from '../type/color-type';

interface IAvatarGroupProps {
	className?: string;
	children: React.ReactElement<IAvatarProps>[]; // Mudança aqui
	size?: number;
  }
export const AvatarGroup: FC<IAvatarGroupProps> = ({ className, children, size }) => {
	const { darkModeStatus } = useDarkMode();

	// Filtra apenas os filhos que são renderizáveis (não nulos ou indefinidos)
	const validChildren = Children.toArray(children).filter(
		(child) => child !== null && child !== undefined,
	);

	return (
		<div className={classNames('avatar-group', className)}>
			<div className='avatar-container'>
				{Children.map(children, (child, index) => {
					if (React.isValidElement(child)) {
						const borderColor = darkModeStatus ? 'dark' : 'white';
						const border = 2;
					

						return index < 3
							? React.cloneElement(child, {
									borderColor,
									border,
									size,
								})
							: null;
					}
					return null;
				})}
			</div>
			{validChildren.length > 3 && (
				<Popovers
					desc={validChildren.slice(3).map((child, index) =>
						React.isValidElement(child) ? (
							<>
								{/* @ts-ignore */}
								{child.props.userName}
								<br />
							</>
						) : null,
					)}
					trigger='hover'>
					<div className='avatar-more' style={{ width: size, height: size }}>
						+{validChildren.length - 3}
					</div>
				</Popovers>
			)}
		</div>
	);
};

AvatarGroup.propTypes = {
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	size: PropTypes.number,
};
AvatarGroup.defaultProps = {
	className: undefined,
	size: 32,
};

interface IAvatarProps extends HTMLAttributes<HTMLImageElement> {
	border?: null | 0 | 1 | 2 | 3 | 4 | 5;
	borderColor?: null | TColor | 'link' | 'brand' | 'brand-two' | 'storybook' | 'white';
	className?: string;
	color?: TColor | 'link' | 'brand' | 'brand-two' | 'storybook';
	isOnline?: boolean;
	isReply?: boolean;
	rounded?: 'default' | 0 | 1 | 2 | 3 | 'bottom' | 'top' | 'circle' | 'end' | 'start' | 'pill';
	shadow?: 'none' | 'sm' | 'default' | 'lg' | null;
	size?: number;
	src: string;
	userName?: string | null;
}
const Avatar: FC<IAvatarProps> = ({
	src,
	className,
	size,
	rounded,
	shadow,

	border,
	borderColor,
	userName,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isOnline, // Not used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isReply, // Not used
}) => {
	const { darkModeStatus } = useDarkMode();

	const INNER = (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			className={classNames(
				'avatar',
				{
					[`rounded${rounded !== 'default' ? `-${rounded}` : ''}`]: rounded,
					'rounded-0': rounded === 0,
					[`shadow${shadow !== 'default' ? `-${shadow}` : ''}`]: !!shadow,
					border: !!border,
					[`border-${border}`]: !!border,
					[`border-${borderColor}`]: borderColor,
				},

				className,
			)}
			src={src}
			alt=''
			width={size}
			height={size}
		/>
	);

	if (userName) {
		return (
			<Popovers desc={userName} trigger='hover'>
				{INNER}
			</Popovers>
		);
	}
	return INNER;
};
Avatar.displayName = 'Avatar';
Avatar.propTypes = {
	className: PropTypes.string,
	size: PropTypes.number,
	rounded: PropTypes.oneOf([
		'default',
		0,
		1,
		2,
		3,
		'bottom',
		'top',
		'circle',
		'end',
		'start',
		'pill',
	]),
	color: PropTypes.oneOf([
		null,
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
	]),
	shadow: PropTypes.oneOf([null, 'none', 'sm', 'default', 'lg']),
	border: PropTypes.oneOf([null, 0, 1, 2, 3, 4, 5]),
	borderColor: PropTypes.oneOf([
		null,
		'primary',
		'secondary',
		'success',
		'info',
		'warning',
		'danger',
		'light',
		'dark',
		'link',
		'brand',
		'brand-two',
		'storybook',
		'white',
	]),
	userName: PropTypes.string,
	isOnline: PropTypes.bool,
	isReply: PropTypes.bool,
};
Avatar.defaultProps = {
	className: undefined,
	size: 128,
	rounded: 'circle',
	color: 'primary',
	shadow: null,
	border: null,
	borderColor: null,
	userName: null,
	isOnline: false,
	isReply: false,
};

export default Avatar;
