
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Users, BellRing, Database, KeyRound, Palette, Building, Mail, Loader2, Save, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const CompanyProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile || { name: '', contact_email: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(profile || { name: '', contact_email: '', address: '' });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: existingEntry, error: selectError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'company_profile')
        .single();

      if (selectError && selectError.code === 'PGRST116') { // Not found, insert
        const { error: insertError } = await supabase
          .from('app_settings')
          .insert({ key: 'company_profile', value: formData, description: 'Basic company information', updated_at: new Date().toISOString() });
        if (insertError) throw insertError;
      } else if (selectError) { // Other select error
        throw selectError;
      } else { // Found, update
        const { error: updateError } = await supabase
          .from('app_settings')
          .update({ value: formData, updated_at: new Date().toISOString() })
          .eq('key', 'company_profile');
        if (updateError) throw updateError;
      }

      toast({ title: "Perfil da Empresa Atualizado", description: "As informações da empresa foram salvas." });
      onSave(formData);
    } catch (error) {
      console.error("Error saving company profile:", error);
      toast({ variant: "destructive", title: "Erro ao Salvar", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Nome da Empresa</Label>
        <Input id="company_name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="contact_email">E-mail de Contato Principal</Label>
        <Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Perfil
        </Button>
      </DialogFooter>
    </form>
  );
};


const SettingsPage = () => {
  const [companyProfile, setCompanyProfile] = useState({ name: '', contact_email: '', address: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchCompanyProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'company_profile')
        .single();

      if (error && error.code !== 'PGRST116') { 
        throw error;
      }
      if (data && data.value) {
        setCompanyProfile(data.value);
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
      toast({ variant: "destructive", title: "Erro ao Carregar Perfil", description: "Não foi possível carregar as informações da empresa." });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const handleProfileSave = (updatedProfile) => {
    setCompanyProfile(updatedProfile);
    setIsProfileModalOpen(false);
    fetchCompanyProfile(); 
  };
  
  const settingsOptions = [
    { 
      title: "Perfil da Empresa", 
      description: "Gerencie nome, contato e endereço da sua empresa.", 
      icon: Building, 
      action: () => setIsProfileModalOpen(true) 
    },
    { title: "Gerenciamento de Usuários", description: "Adicione, edite ou remova usuários e seus papéis.", icon: Users, action: () => toast({title: "Em Breve", description: "Funcionalidade de gerenciamento de usuários será implementada."}) },
    { title: "Notificações", description: "Configure alertas por e-mail, Whatsapp ou push.", icon: BellRing, action: () => toast({title: "Em Breve", description: "Configurações de notificação serão implementadas."}) },
    { title: "Integrações", description: "Conecte com ERP, SCADA/IoT e fornecedores.", icon: Database, action: () => toast({title: "Em Breve", description: "Opções de integração serão implementadas."}) },
    { title: "Segurança", description: "Configure autenticação multifator e políticas de acesso.", icon: KeyRound, action: () => toast({title: "Em Breve", description: "Configurações de segurança serão implementadas."}) },
    { title: "Aparência", description: "Personalize temas (claro/escuro). O tema é salvo automaticamente.", icon: Palette, action: () => toast({title: "Aparência", description: "Mude o tema no cabeçalho. Sua preferência é salva automaticamente."}) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Ajuste as preferências e configurações gerais da aplicação.</p>
      </div>

      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="text-xl">Informações da Empresa</CardTitle>
          {loadingProfile ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <CardDescription>
              <strong>{companyProfile.name || "Nome da Empresa não definido"}</strong><br />
              <Mail className="inline h-4 w-4 mr-1 text-muted-foreground" />{companyProfile.contact_email || "E-mail não definido"}<br />
              <Building className="inline h-4 w-4 mr-1 text-muted-foreground" />{companyProfile.address || "Endereço não definido"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsProfileModalOpen(true)}>
            <Edit3 className="mr-2 h-4 w-4" /> Editar Informações da Empresa
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil da Empresa</DialogTitle>
            <DialogDescription>Atualize as informações da sua empresa.</DialogDescription>
          </DialogHeader>
          {loadingProfile ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" /> : <CompanyProfileForm profile={companyProfile} onSave={handleProfileSave} onCancel={() => setIsProfileModalOpen(false)} />}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <option.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
              <Button variant="outline" className="w-full" onClick={option.action}>
                Acessar {option.title.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
  