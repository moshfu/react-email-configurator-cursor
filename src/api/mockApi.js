import { v4 as uuidv4 } from 'uuid';

const getDefaultData = (table) => {
    switch (table) {
        case 'users':
            return [
                { id: 'admin-01', username: 'admin', password: 'password123', role: 'admin', mustChangePassword: false, group: 'none' },
                { id: 'user-01', username: 'testuser', password: 'password', role: 'user', mustChangePassword: true, group: 'none' },
                { id: 'hotel-user', username: 'registration.manager', password: 'password123', role: 'user', mustChangePassword: false, group: 'hotel' },
                { id: 'accom-user', username: 'accom.manager', password: 'password123', role: 'user', mustChangePassword: false, group: 'accommodation' },
            ];
        case 'globalTemplates':
            return {
                'standard-template-id': {
                    id: 'standard-template-id', name: 'Standard Template', category: 'General', visibility: 'global',
                    includeWalletButtons: true, includeOuterBorder: true, lineWidth: 2, outerBorderColor: '#e5e7eb', eventAbbreviation: 'REACT', copyrightYear: '2025',
                    bodyBackgroundColor: '#ffffff', bodyTextColor: '#333333', linkColor: '#00519e', dividerColor: '#dddddd', footerBackgroundColor: '#f5f5f5', footerTextColor: '#555555',
                    templateFontFamily: 'Roboto', bodyFontSize: 14, paragraphLineHeight: 1.6, tableBorderRadius: 10,
                    // eslint-disable-next-line no-template-curly-in-string
                    salutationInput: 'Dear ${p.firstName} ${p.lastName},', salutationFontSize: 16, salutationStyles: ['normal'],
                    organizingTeamName: 'KIT Group Organizing Team', organizingTeamFontSize: 14, organizingTeamStyles: ['bold'],
                    footerFontSize: 12, footerStyles: ['normal'], footerPadding: 20, footerBorderRadius: 10, footerText: '© 2025 REACT - All rights reserved.',
                    banners: [
                        {
                            id: 'default-banner',
                            url: 'https://kit-react.de/regasus/api/rest/v1/content/201741246770244/02_REACT_Group.png',
                            altText: 'Event Banner',
                            location: 'top',
                            placement: 'before',
                            height: 200,
                            enabled: true
                        }
                    ],
                    includeTopPadding: false,
                    topPaddingHeight: 20,
                    topPaddingBackgroundColor: '#f5f5f5',
                    topPaddingTextColor: '#555555',
                    topPaddingText: '',
                    topPaddingFontSize: 12,
                    includeFooter: true,
                    showAddress: true, showCaretOf: true, showAssociationManagement: true,
                    contactName: 'John Doe', contactEmail: 'info@regasus.de', contactPhone: '+49 30 1234 5678', contactWebsite: 'www.kit-group.org',
                    facebookUrl: 'https://facebook.com', twitterUrl: 'https://x.com', linkedinUrl: '', instagramUrl: 'https://instagram.com', youtubeUrl: '', miscUrl: '',
                    socialLinks: { facebookUrl: 'https://facebook.com', twitterUrl: 'https://x.com', linkedinUrl: '', instagramUrl: 'https://instagram.com', youtubeUrl: '', miscUrl: '' },
                    socialIconSize: 24,
                    socialIconBorderRadius: 0,
                    sectionTitles: [], ctaButtons: [],
                    walletPlacement: 'after-intro', walletBackgroundColor: '#f8f9fa', walletIntroText: 'Please open this e-mail on your mobile phone.\n\nClick the buttons below to add your conference ticket to your wallet.', walletIntroFontSize: 12, walletIntroStyles: ['normal'],
                    walletInstructionsText: 'Please open this e-mail on your mobile phone.\nClick the buttons below to add your conference ticket to your wallet.\nAt the venue, please proceed to the self-printing terminals to print your badge.', walletInstructionsFontSize: 12, walletInstructionsStyles: ['normal'],
                },
                'hotel-template-id': { id: 'hotel-template-id', name: 'Registration Confirmation', category: 'Registration Templates', visibility: 'hotel', bodyBackgroundColor: '#f0f8ff', templateFontFamily: 'Lato' },
                'accom-template-id': { id: 'accom-template-id', name: 'Private Apartment Booking', category: 'Accommodation Templates', visibility: 'accommodation', linkColor: '#228B22', templateFontFamily: 'Merriweather' },
            };
        case 'userTemplates':
            return [];
        case 'rolesAndGroups':
            return {
                roles: [
                    { id: 'admin', name: 'Admin', description: 'Full system access' },
                    { id: 'user', name: 'Standard User', description: 'Basic user access' },
                    { id: 'manager', name: 'Manager', description: 'Team management access' }
                ],
                groups: [
                    { id: 'none', name: 'None', description: 'No specific group', canSeeGroups: ['none'] },
                    { id: 'hotel', name: 'Registration Division', description: 'Registration team access', canSeeGroups: ['hotel'] },
                    { id: 'accommodation', name: 'Accommodation Division', description: 'Accommodation team access', canSeeGroups: ['accommodation'] },
                    { id: 'admin-group', name: 'Admin Group', description: 'Admins can see all', canSeeGroups: ['none', 'hotel', 'accommodation', 'admin-group', 'manager'] },
                    { id: 'manager', name: 'Manager Group', description: 'Managers can see hotel and accommodation', canSeeGroups: ['hotel', 'accommodation', 'manager'] }
                ]
            };
        case 'globalSettings':
            return {
                placeholders: {
                    salutation: 'Dear Attendee,', eventAbbreviation: 'EVENT', teamName: 'The Event Team',
                    bannerImageAltText: 'Event Banner', socialTextInput: 'Follow us on social media',
                    contactEmail: 'info@example.com', contactPhone: '+1 234 567 890', websiteUrl: 'www.example.com',
                },
                defaults: {
                    lineWidth: 2,
                    outerBorderColor: '#e5e7eb',
                },
                imageUrls: {
                    bannerDefault: 'https://kit-react.de/regasus/api/rest/v1/content/201741246770244/02_REACT_Group.png',
                    appleWallet: 'https://kit-react.de/regasus/api/rest/v1/content/201741246770210/US-UK_Add_to_Apple_Wallet_RGB_101421.png',
                    googleWallet: 'https://kit-react.de/regasus/api/rest/v1/content/201741246770209/enIN_add_to_google_wallet_add-wallet-badge.png',
                    socialX: 'https://img.icons8.com/ios-filled/50/000000/x.png',
                    socialFacebook: 'https://img.icons8.com/ios-filled/50/000000/facebook-new.png',
                    socialLinkedIn: 'https://img.icons8.com/ios-filled/50/000000/linkedin.png',
                    socialInstagram: 'https://img.icons8.com/ios-filled/50/000000/instagram-new.png',
                    socialYoutube: 'https://img.icons8.com/ios-filled/50/000000/youtube-play.png',
                    socialMisc: 'https://img.icons8.com/ios-filled/50/000000/globe.png',
                    iconEmail: 'https://img.icons8.com/ios-glyphs/30/000000/email.png',
                    iconPhone: 'https://img.icons8.com/ios-filled/50/000000/phone.png',
                    iconWebsite: 'https://img.icons8.com/ios-glyphs/30/000000/globe.png',
                }
            };
        default:
            return {};
    }
};

const initializeDB = () => {
    ['users', 'globalTemplates', 'userTemplates', 'globalSettings', 'rolesAndGroups'].forEach(table => {
        if (!localStorage.getItem(table)) {
            localStorage.setItem(table, JSON.stringify(getDefaultData(table)));
        }
    });
};

initializeDB();

const db = {
    get: (table) => {
        const data = localStorage.getItem(table);
        if (data === null) {
            const defaultData = getDefaultData(table);
            localStorage.setItem(table, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    },
    set: (table, data) => localStorage.setItem(table, JSON.stringify(data)),
};

const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));

// Toggle this flag to switch between real backend and mock API
const USE_REAL_API = true;

const realApi = {
  async login(username, password) {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      let message = 'Login failed';
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {}
      return { success: false, message };
    }
    const data = await res.json();
    return { success: true, user: data.user, token: data.token };
  },
  async getUsers() {
    const res = await fetch('http://localhost:4000/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  async getRoles() {
    const res = await fetch('http://localhost:4000/api/roles');
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },
  async getGroups() {
    const res = await fetch('http://localhost:4000/api/groups');
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
  },
  async getTemplates() {
    const res = await fetch('http://localhost:4000/api/templates');
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },
  async getGlobalSettings() {
    // No backend endpoint yet, so return a default object
    return {};
  },
  async getAllTemplatesForAdmin() {
    // No backend endpoint yet, so return empty arrays
    return { global: [], user: [] };
  },
};

export const api = USE_REAL_API ? realApi : {
    async login(username, password) {
        const res = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          if (!res.ok) throw new Error('Login failed');
          return res.json();
        },

    async changePassword(userId, newPassword, oldPassword) {
        await delay();
        let users = db.get('users');
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            if (oldPassword && users[userIndex].password !== oldPassword) {
                return { success: false, message: 'Incorrect old password.' };
            }
            users[userIndex].password = newPassword;
            users[userIndex].mustChangePassword = false;
            db.set('users', users);
            return { success: true, user: users[userIndex] };
        }
        return { success: false, message: 'User not found' };
    },

    async getTemplates(user) {
        await delay();
        const allGlobal = Object.values(db.get('globalTemplates'));
        const rolesAndGroups = db.get('rolesAndGroups');
        const userGroup = (rolesAndGroups.groups || []).find(g => g.id === user.group);
        const canSeeGroups = userGroup?.canSeeGroups || [user.group];
        const visibleGlobal = allGlobal.filter(t => 
            t.visibility === 'global' || canSeeGroups.includes(t.visibility)
        );
        const userSpecific = (db.get('userTemplates') || []).filter(t => t.ownerId === user.id);
        return { global: visibleGlobal, user: userSpecific };
    },
    
    async getAllTemplatesForAdmin() {
        await delay();
        return { 
            global: Object.values(db.get('globalTemplates')), 
            user: db.get('userTemplates') || []
        };
    },

    async saveTemplate(userId, templateData) {
        await delay();
        let templates = db.get('userTemplates') || [];
        const existingIndex = templates.findIndex(t => t.id === templateData.id);
        if (existingIndex > -1) {
            templates[existingIndex] = { ...templates[existingIndex], ...templateData, ownerId: userId };
        } else {
            templates.push({ ...templateData, id: uuidv4(), ownerId: userId, category: 'My Templates' });
        }
        db.set('userTemplates', templates);
        return { success: true };
    },
    
    async getUsers() {
        await delay();
        return Object.values(db.get('users')).map(({ password, ...user }) => user);
    },

    async createUser(username, role, group) {
        await delay();
        let users = db.get('users');
        const randomPassword = Math.random().toString(36).slice(-8);
        const newUser = { id: uuidv4(), username, password: randomPassword, role, group, mustChangePassword: true };
        users.push(newUser);
        db.set('users', users);
        return { success: true, newUser: { ...newUser, password: randomPassword } };
    },

    async deleteUser(userId) {
        await delay();
        let users = db.get('users');
        const updatedUsers = users.filter(u => u.id !== userId);
        db.set('users', updatedUsers);
        return { success: true };
    },

    async updateUser(userId, data) {
        await delay();
        let users = db.get('users');
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            users[userIndex] = { ...users[userIndex], ...data };
            db.set('users', users);
            return { success: true };
        }
        return { success: false, message: 'User not found' };
    },
    
    async resetUserPassword(userId) {
        await delay();
        let users = db.get('users');
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            const newPassword = Math.random().toString(36).slice(-8);
            users[userIndex].password = newPassword;
            users[userIndex].mustChangePassword = true;
            db.set('users', users);
            return { success: true, newPassword };
        }
        return { success: false, message: "User not found" };
    },
    
    async getGlobalSettings() {
        await delay();
        return db.get('globalSettings');
    },

    async updateGlobalSettings(newSettings) {
        await delay();
        db.set('globalSettings', newSettings);
        return { success: true };
    },
    
    async saveGlobalTemplate(templateData) {
        await delay();
        let templates = db.get('globalTemplates');
        if (!templateData.id) {
            templateData.id = uuidv4();
        }
        templates[templateData.id] = templateData;
        db.set('globalTemplates', templates);
        return { success: true };
    },

    async updateGlobalTemplate(templateData) {
        await delay();
        let templates = db.get('globalTemplates');
        if (templates[templateData.id]) {
            templates[templateData.id] = { ...templates[templateData.id], ...templateData };
            db.set('globalTemplates', templates);
            return { success: true };
        }
        return { success: false, message: 'Template not found.' };
    },

    async deleteGlobalTemplate(templateId) {
        await delay();
        let templates = db.get('globalTemplates');
        delete templates[templateId];
        db.set('globalTemplates', templates);
        return { success: true };
    },

    async deleteUserTemplate(userId, templateId) {
        await delay();
        let templates = db.get('userTemplates') || [];
        const initialLength = templates.length;
        const updatedTemplates = templates.filter(t => !(t.id === templateId && t.ownerId === userId));
        if (initialLength === updatedTemplates.length) {
            return { success: false, message: 'Template not found or permission denied.' };
        }
        db.set('userTemplates', updatedTemplates);
        return { success: true };
    },

    async getRoles() {
        await delay();
        const rolesAndGroups = db.get('rolesAndGroups');
        return rolesAndGroups.roles || [];
    },

    async getGroups() {
        await delay();
        const rolesAndGroups = db.get('rolesAndGroups');
        return rolesAndGroups.groups || [];
    },

    async saveRole(roleData) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let roles = rolesAndGroups.roles || [];
        
        if (!roleData.id) {
            roleData.id = uuidv4();
        }
        
        const existingIndex = roles.findIndex(r => r.id === roleData.id);
        if (existingIndex > -1) {
            roles[existingIndex] = { ...roles[existingIndex], ...roleData };
        } else {
            roles.push(roleData);
        }
        
        db.set('rolesAndGroups', { ...rolesAndGroups, roles });
        return { success: true };
    },

    async updateRole(roleData) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let roles = rolesAndGroups.roles || [];
        
        const existingIndex = roles.findIndex(r => r.id === roleData.id);
        if (existingIndex > -1) {
            roles[existingIndex] = { ...roles[existingIndex], ...roleData };
            db.set('rolesAndGroups', { ...rolesAndGroups, roles });
            return { success: true };
        }
        return { success: false, message: 'Role not found.' };
    },

    async deleteRole(roleId) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let roles = rolesAndGroups.roles || [];
        
        const updatedRoles = roles.filter(r => r.id !== roleId);
        db.set('rolesAndGroups', { ...rolesAndGroups, roles: updatedRoles });
        return { success: true };
    },

    async saveGroup(groupData) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let groups = rolesAndGroups.groups || [];
        if (!groupData.id) {
            groupData.id = uuidv4();
        }
        const existingIndex = groups.findIndex(g => g.id === groupData.id);
        if (existingIndex > -1) {
            groups[existingIndex] = { ...groups[existingIndex], ...groupData };
        } else {
            groups.push({ ...groupData, canSeeGroups: groupData.canSeeGroups || [groupData.id] });
        }
        db.set('rolesAndGroups', { ...rolesAndGroups, groups });
        return { success: true };
    },

    async updateGroup(groupData) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let groups = rolesAndGroups.groups || [];
        const existingIndex = groups.findIndex(g => g.id === groupData.id);
        if (existingIndex > -1) {
            groups[existingIndex] = { ...groups[existingIndex], ...groupData };
            db.set('rolesAndGroups', { ...rolesAndGroups, groups });
            return { success: true };
        }
        return { success: false, message: 'Group not found.' };
    },

    async deleteGroup(groupId) {
        await delay();
        let rolesAndGroups = db.get('rolesAndGroups');
        let groups = rolesAndGroups.groups || [];
        
        const updatedGroups = groups.filter(g => g.id !== groupId);
        db.set('rolesAndGroups', { ...rolesAndGroups, groups: updatedGroups });
        return { success: true };
    },
};
