import React, { useState } from 'react';
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Icon from '../../../components/icon/Icon';
import { putUpdateUser } from '../../../api/routes';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Funcionario {
  nome: string;
  email: string;
  telemovel: string;
  nif: string;
}

const ProfileEditForm = ({ funcionario }: { funcionario: Funcionario }) => {
  const [formData, setFormData] = useState({
    nome: funcionario?.nome || '',
    email: funcionario?.email || '',
    telemovel: funcionario?.telemovel || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const data = {
      nome: formData.nome,
      email: formData.email,
      telemovel: formData.telemovel,
      nif: funcionario.nif,
      foto: null,
      password: formData.newPassword,
    };

    putUpdateUser(data)
      .then((res) => {
        toast.success('Dados atualizados com sucesso!');
        setTimeout(() => {
          window.location.reload(); // Recarrega a página após o aviso
        }, 2000); // Aguarda 2 segundos para que o usuário veja o aviso
      })
      .catch((err) => {
        toast.error('Erro ao atualizar os dados.');
        console.error(err);
      });
  };

  return (
    <div className="col-lg-8">
      <Card className="shadow-3d-info">
        <CardHeader>
          <CardLabel icon="Edit" iconColor="info">
            <CardTitle>Editar Perfil</CardTitle>
          </CardLabel>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Informações Pessoais */}
              <div className="col-12">
                <div className="border-bottom pb-3 mb-4">
                  <h5 className="text-info">
                    <Icon icon="Person" className="me-2" size="lg" />
                    Informações Pessoais
                  </h5>
                </div>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Telemóvel</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telemovel"
                      value={formData.telemovel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Alteração de Senha */}
              <div className="col-12">
                <div className="border-bottom pb-3 mb-4">
                  <h5 className="text-info">
                    <Icon icon="Lock" className="me-2" size="lg" />
                    Alterar Senha
                  </h5>
                </div>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="col-12">
                <div className="d-flex gap-2 justify-content-end">
                  <Button color="info" type="submit" icon="Save">
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileEditForm;
