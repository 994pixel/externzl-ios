EXTERNAL LY — PROJETO IOS

Este pacote contém um projeto SwiftUI/WKWebView que empacota a interface web recebida como aplicativo iOS.

PARA GERAR O IPA:
1. Em um Mac com Xcode, abra ExternalLy.xcodeproj.
2. Selecione o target ExternalLy > Signing & Capabilities.
3. Selecione sua equipe/assinatura Apple e altere o Bundle Identifier para um identificador exclusivo seu.
4. Selecione um destino iOS (Generic iOS Device) e escolha Product > Archive.
5. No Organizer, escolha Distribute App e exporte com o método compatível com sua assinatura.

LIMITAÇÕES DA INTERFACE RECEBIDA:
- API_BASE está vazio no app.js. Login real por KEY não funcionará até configurar e publicar o backend.
- As KEYS administrativas são demonstração em memória e não persistem.
- Controles ESP/aimbot são apenas elementos visuais; este pacote não implementa interação com o jogo nem bypass de anti-cheat.

O projeto não inclui certificado, provisioning profile ou IPA assinado.
