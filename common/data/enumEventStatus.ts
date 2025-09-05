import COLORS from './enumColors';
import { TColor } from '../../type/color-type';

export interface IEventStatus {
	[key: string]: { name: string; color: TColor };
}
const EVENT_STATUS: IEventStatus = {
	EmAndamento: { name: 'Em Curso', color: COLORS.PRIMARY.name },
	Pendente: { name: 'Pendente', color: COLORS.WARNING.name },
	Concluido: { name: 'Concluído', color: COLORS.SUCCESS.name },
};
export default EVENT_STATUS;
