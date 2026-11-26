EXTERNAL LY — PROJETO IOS / CODemagic

Este pacote contém um projeto SwiftUI/WKWebView e workflow Codemagic para compilar um IPA NÃO ASSINADO.

PASSOS:
1. Envie o conteúdo deste ZIP para o mesmo repositório GitHub conectado ao Codemagic, substituindo os arquivos antigos.
2. Confirme que codemagic.yaml está na raiz do repositório e que a branch usada é main.
3. No Codemagic, abra o app/repositório e inicie um novo build usando o workflow "external-ly-unsigned-ipa".
4. Se a compilação terminar com sucesso, baixe ExternalLy-unsigned.ipa em Artifacts.
5. Esse IPA não está assinado e não instala diretamente no iPhone. Só deve ser assinado depois com um certificado e perfil que você tenha autorização para usar. O Zeex pode aceitar o arquivo para assinatura, mas confirme que a assinatura é sua ou foi autorizada pelo titular.

LIMITAÇÕES:
- API_BASE está vazio em app.js. Login real por KEY não funcionará até configurar e publicar o backend.
- As KEYS administrativas são demonstração em memória e não persistem.
- Controles ESP/aimbot são apenas elementos visuais; não implementam interação com o jogo nem bypass de anti-cheat.
- Este pacote não contém certificado, perfil de provisionamento nem IPA já compilado.
