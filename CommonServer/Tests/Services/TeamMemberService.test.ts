import '../TestingUtils/Init';
import Database from '../TestingUtils/Database';
import UserServiceHelper from '../TestingUtils/Services/UserServiceHelper';
import ProjectServiceHelper from '../TestingUtils/Services/ProjectServiceHelper';
import TeamServiceHelper from '../TestingUtils/Services/TeamServiceHelper';
import TeamMemberServiceHelper from '../TestingUtils/Services/TeamMemberServiceHelper';

import ObjectID from 'Common/Types/ObjectID';
import Email from 'Common/Types/Email';
import { faker } from '@faker-js/faker';

import TeamMember from 'Model/Models/TeamMember';
import User from 'Model/Models/User';
import Project from 'Model/Models/Project';
import Team from 'Model/Models/Team';

import TeamService from '../../Services/TeamService';
import { TeamMemberService } from '../../Services/TeamMemberService';
import AccessTokenService from '../../Services/AccessTokenService';
import BillingService from '../../Services/BillingService';
import ProjectService from '../../Services/ProjectService';
import MailService from '../../Services/MailService';
import UserNotificationSettingService from '../../Services/UserNotificationSettingService';
import UserNotificationRuleService from '../../Services/UserNotificationRuleService';

import Errors from '../../Utils/Errors';
import CreateBy from '../../Types/Database/CreateBy';

const testDatabase: Database = new Database();

// mock PostgresDatabase because we need it across all services
jest.mock('../../Infrastructure/PostgresDatabase', () => {
    const actualModule: any = jest.requireActual(
        '../../Infrastructure/PostgresDatabase'
    );
    return {
        __esModule: true,
        default: actualModule.default,
        PostgresAppInstance: {
            getDataSource: () => {
                return testDatabase.getDatabase().getDataSource();
            },
            isConnected: () => {
                return testDatabase.getDatabase().isConnected();
            },
        },
    };
});

// mock Redis
jest.mock('../../Infrastructure/GlobalCache', () => {
    return {
        setJSON: jest.fn(),
        getJSON: jest.fn(),
        setString: jest.fn(),
        getString: jest.fn(),
    };
});

jest.mock('../../Services/AccessTokenService', () => {
    const actualModule: any = jest.requireActual(
        '../../Services/AccessTokenService'
    );
    return {
        __esModule: true,
        default: actualModule.default,
        refreshUserGlobalAccessPermission: jest.fn(),
        refreshUserTenantAccessPermission: jest.fn(),
    };
});

jest.mock('../../Services/BillingService');
jest.mock('../../Services/ProjectService');

describe('TeamMemberService', () => {
    let teamMemberService!: TeamMemberService;

    let user!: User;
    let project!: Project;
    let team!: Team;

    beforeEach(async () => {
        await testDatabase.createAndConnect();

        teamMemberService = new TeamMemberService(testDatabase.getDatabase());

        user = UserServiceHelper.generateRandomUser().data;
        user = await user.save();

        project = ProjectServiceHelper.generateRandomProject(
            new ObjectID(user._id!)
        ).data;
        project = await project.save();

        team = TeamServiceHelper.generateRandomTeam(
            new ObjectID(project._id!),
            new ObjectID(user._id!)
        ).data;
        team = await team.save();
    });

    afterEach(async () => {
        await testDatabase.disconnectAndDropDatabase();
        jest.resetAllMocks();
    });

    describe('create tests', () => {
        it('should create a new team member', async () => {
            process.env['SUBSCRIPTION_PLAN_1'] = undefined;
            process.env['SUBSCRIPTION_PLAN_2'] = undefined;

            ProjectService.findOneById = jest.fn().mockResolvedValue({
                _id: project._id,
            });

            TeamService.findOneById = jest.fn().mockResolvedValue(team);

            const tm: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!),
                    team
                );
            const teamMember: TeamMember = await teamMemberService.create(tm);

            expect(teamMember.userId).toEqual(new ObjectID(user._id!));
            expect(teamMember.projectId).toEqual(new ObjectID(project._id!));
            expect(teamMember.hasAcceptedInvitation).toBeFalsy();
        });

        describe('onBeforeCreate', () => {
            it('should throw exception if the user limit for a project is reached', async () => {
                const SEATS_LIMIT: number = 5;

                ProjectService.findOneById = jest.fn().mockResolvedValue({
                    seatLimit: SEATS_LIMIT,
                    paymentProviderSubscriptionSeats: SEATS_LIMIT,
                    _id: project._id,
                });

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                await expect(teamMemberService.create(tm)).rejects.toThrow(
                    Errors.TeamMemberService.LIMIT_REACHED
                );
            });

            it('should throw exception if the user has already been invited', async () => {
                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                await teamMemberService.create(tm);

                await expect(teamMemberService.create(tm)).rejects.toThrow(
                    Errors.TeamMemberService.ALREADY_INVITED
                );
            });

            it('should create user if the invited user does not exist in the system', async () => {
                jest.spyOn(MailService, 'sendMail').mockResolvedValue(null!);

                const nonExistingUserEmail: string = faker.internet.email();
                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team,
                        { email: nonExistingUserEmail }
                    );
                const teamMember: TeamMember = await teamMemberService.create(
                    tm
                );

                expect(teamMember).toBeDefined();
                expect(teamMember.userId).toBeDefined();
            });

            it('should send email when inviting non existing user', async () => {
                jest.spyOn(MailService, 'sendMail').mockResolvedValue(null!);

                ProjectService.findOneById = jest.fn().mockResolvedValue({
                    name: project.name,
                    _id: project._id,
                });

                const nonExistingUserEmail: string = faker.internet
                    .email()
                    .toLowerCase();
                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team,
                        { email: nonExistingUserEmail }
                    );
                await teamMemberService.create(tm);

                expect(MailService.sendMail).toHaveBeenCalledWith(
                    {
                        subject: `You have been invited to ${project.name}`,
                        templateType: 'InviteMember.hbs',
                        toEmail: new Email(nonExistingUserEmail),
                        vars: {
                            homeUrl: 'http://localhost/',
                            isNewUser: 'true',
                            projectName: project.name,
                            registerLink: `http://localhost/accounts/register?email=${nonExistingUserEmail.replace(
                                '@',
                                '%40'
                            )}`,
                            signInLink: 'http://localhost/accounts',
                        },
                    },
                    {
                        projectId: new ObjectID(project._id!),
                    }
                );
            });

            it('should handle unexpected errors', async () => {
                jest.spyOn(teamMemberService, 'create').mockRejectedValue(
                    new Error('Unexpected error')
                );

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                await expect(teamMemberService.create(tm)).rejects.toThrow(
                    'Unexpected error'
                );
            });
        });

        describe('onCreateSuccess', () => {
            it('should call functions to refresh tokens and update subscription seats on success', async () => {
                const refreshTokensSpy: jest.SpyInstance = jest
                    .spyOn(TeamMemberService.prototype, 'refreshTokens')
                    .mockResolvedValue();
                const updateSeatsSpy: jest.SpyInstance = jest
                    .spyOn(
                        TeamMemberService.prototype,
                        'updateSubscriptionSeatsByUniqueTeamMembersInProject'
                    )
                    .mockResolvedValue();

                const user: User =
                    await UserServiceHelper.generateRandomUser().data.save();

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                const teamMember: TeamMember = await teamMemberService.create(
                    tm
                );

                expect(refreshTokensSpy).toHaveBeenCalledWith(
                    teamMember.userId,
                    teamMember.projectId
                );
                expect(updateSeatsSpy).toHaveBeenCalledWith(
                    new ObjectID(project._id!)
                );
            });
        });
    });

    describe('update tests', () => {
        it('should update team member', async () => {
            // (1) create new team member
            const user: User =
                await UserServiceHelper.generateRandomUser().data.save();

            const tm: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!),
                    team
                );
            const teamMember: TeamMember = await teamMemberService.create(tm);

            expect(teamMember?.hasAcceptedInvitation).toBe(false);

            // (2) update team member
            const updatedInfo: { hasAcceptedInvitation: boolean } = {
                hasAcceptedInvitation: true,
            };

            const updatedCount: number = await teamMemberService.updateOneBy({
                query: {
                    _id: teamMember._id!,
                },
                data: updatedInfo,
                props: { isRoot: true },
            });

            // check update was successful (1 document should be affected)
            expect(updatedCount).toBe(1);

            // (3) retrieve the updated team member and validate changes
            const updatedTeamMember: TeamMember | null =
                await teamMemberService.findOneById({
                    id: new ObjectID(teamMember._id!),
                    select: { hasAcceptedInvitation: true },
                    props: { isRoot: true },
                });

            expect(updatedTeamMember).toBeTruthy();
            expect(updatedTeamMember?.hasAcceptedInvitation).toBe(
                updatedInfo.hasAcceptedInvitation
            );
        });

        describe('onUpdateSuccess', () => {
            it('should refresh tokens and handle user notification settings on update', async () => {
                const user: User =
                    await UserServiceHelper.generateRandomUser().data.save();

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                const teamMember: TeamMember = await teamMemberService.create(
                    tm
                );

                const refreshTokensSpy: jest.SpyInstance = jest
                    .spyOn(TeamMemberService.prototype, 'refreshTokens')
                    .mockResolvedValue();
                const addDefaultNotificationSettingsSpy: jest.SpyInstance = jest
                    .spyOn(
                        UserNotificationSettingService,
                        'addDefaultNotificationSettingsForUser'
                    )
                    .mockResolvedValue();
                const addDefaultNotificationRuleForUserSpy: jest.SpyInstance =
                    jest
                        .spyOn(
                            UserNotificationRuleService,
                            'addDefaultNotificationRuleForUser'
                        )
                        .mockResolvedValue();

                const updatedInfo: { hasAcceptedInvitation: boolean } = {
                    hasAcceptedInvitation: true,
                };
                await teamMemberService.updateOneBy({
                    query: { _id: teamMember._id! },
                    data: updatedInfo,
                    props: { isRoot: true },
                });

                expect(refreshTokensSpy).toHaveBeenCalledWith(
                    teamMember.userId,
                    teamMember.projectId
                );
                expect(addDefaultNotificationSettingsSpy).toHaveBeenCalledWith(
                    new ObjectID(user._id!),
                    new ObjectID(project._id!)
                );
                expect(
                    addDefaultNotificationRuleForUserSpy
                ).toHaveBeenCalledWith(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!),
                    user.email
                );
            });
        });
    });

    describe('delete tests', () => {
        it('should delete team member', async () => {
            // (1) create new team member
            const user: User =
                await UserServiceHelper.generateRandomUser().data.save();

            const tm: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!),
                    team
                );
            const teamMember: TeamMember = await teamMemberService.create(tm);

            // (2) delete team member
            const deleteCount: number = await teamMemberService.deleteOneBy({
                query: { _id: teamMember._id! },
                props: { isRoot: true },
            });

            // ensure deletion was successful (1 document should be affected)
            expect(deleteCount).toBe(1);

            // (3) verify that the team member no longer exists
            const deletedTeamMember: TeamMember | null =
                await teamMemberService.findOneBy({
                    query: { _id: teamMember._id! },
                    props: { isRoot: true },
                });

            expect(deletedTeamMember).toBeNull();
        });

        describe('onBeforeDelete', () => {
            it('should throw error when one member and team has at least one member requirement', async () => {
                const team: Team = TeamServiceHelper.generateRandomTeam(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!)
                ).data;
                team.shouldHaveAtLeastOneMember = true;
                await team.save();

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                const teamMember: TeamMember = await teamMemberService.create(
                    tm
                );

                // accept invitation
                teamMember.hasAcceptedInvitation = true;
                await teamMember.save();

                try {
                    await teamMemberService.deleteOneBy({
                        query: {
                            _id: teamMember._id!,
                        },
                        props: {
                            isRoot: true,
                        },
                    });
                } catch (errorPromise) {
                    try {
                        await errorPromise;
                    } catch (err: any) {
                        expect(err.message).toEqual(
                            Errors.TeamMemberService.ONE_MEMBER_REQUIRED
                        );
                    }
                }
            });

            it('should not delete when shouldHaveAtLeastOneMember is true and member has not accepted invitation', async () => {
                const team: Team = TeamServiceHelper.generateRandomTeam(
                    new ObjectID(project._id!),
                    new ObjectID(user._id!)
                ).data;
                team.shouldHaveAtLeastOneMember = true;
                await team.save();

                const tm: CreateBy<TeamMember> =
                    TeamMemberServiceHelper.generateRandomTeamMember(
                        new ObjectID(project._id!),
                        new ObjectID(user._id!),
                        team
                    );
                const teamMember: TeamMember = await teamMemberService.create(
                    tm
                );

                await teamMemberService.deleteOneBy({
                    query: { _id: teamMember._id! },
                    props: { isRoot: true },
                });

                const remainingMember: TeamMember | null =
                    await teamMemberService.findOneBy({
                        query: { _id: teamMember._id! },
                        props: { isRoot: true },
                    });
                expect(remainingMember).toBeDefined();
            });

            it('should handle unexpected errors', async () => {
                jest.spyOn(teamMemberService, 'deleteOneBy').mockRejectedValue(
                    new Error('Unexpected error')
                );

                await expect(
                    teamMemberService.deleteOneBy({
                        query: { id: new ObjectID('') },
                        props: { isRoot: true },
                    })
                ).rejects.toThrow('Unexpected error');
            });
        });
    });

    describe('refreshTokens', () => {
        it('should refresh user global and tenant access permissions', async () => {
            jest.restoreAllMocks();

            jest.spyOn(
                AccessTokenService,
                'refreshUserGlobalAccessPermission'
            ).mockResolvedValue(null!);
            jest.spyOn(
                AccessTokenService,
                'refreshUserTenantAccessPermission'
            ).mockResolvedValue(null);

            const userId: ObjectID = new ObjectID(faker.datatype.uuid());
            const projectId: ObjectID = new ObjectID(faker.datatype.uuid());

            await teamMemberService.refreshTokens(userId, projectId);

            expect(
                AccessTokenService.refreshUserGlobalAccessPermission
            ).toHaveBeenCalledWith(userId);
            expect(
                AccessTokenService.refreshUserTenantAccessPermission
            ).toHaveBeenCalledWith(userId, projectId);
        });
    });

    describe('getUniqueTeamMemberCountInProject', () => {
        it('should return the count of unique team members in a project', async () => {
            // make findBy to return 4 team members: 1 normal, 2 with the same id and 1 without a user ID
            // total should be 2 unique team members
            teamMemberService.findBy = jest.fn().mockResolvedValue([
                {
                    _id: faker.datatype.uuid(),
                    userId: faker.datatype.uuid(),
                    memberId: faker.datatype.uuid(),
                },
                {
                    _id: faker.datatype.uuid(),
                    userId: 'duplicated_id',
                    memberId: faker.datatype.uuid(),
                },
                {
                    _id: faker.datatype.uuid(),
                    userId: 'duplicated_id',
                    memberId: faker.datatype.uuid(),
                },
                {
                    _id: faker.datatype.uuid(),
                    memberId: faker.datatype.uuid(),
                },
            ]);

            const count: number =
                await teamMemberService.getUniqueTeamMemberCountInProject(
                    new ObjectID(project._id!)
                );
            expect(count).toBe(2);
        });
    });

    describe('getUsersInTeam(s)', () => {
        it('should return users in specified team', async () => {
            // team A members: user1 & user2
            // team B members: user2 & user3
            // team C members: user 3

            const user1: User =
                await UserServiceHelper.generateRandomUser().data.save();
            const user2: User =
                await UserServiceHelper.generateRandomUser().data.save();
            const user3: User =
                await UserServiceHelper.generateRandomUser().data.save();

            const teamA: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberA1: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user1._id!),
                    teamA
                );
            await teamMemberService.create(teamMemberA1);
            const teamMemberA2: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user2._id!),
                    teamA
                );
            await teamMemberService.create(teamMemberA2);

            const teamB: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberB2: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user2._id!),
                    teamB
                );
            await teamMemberService.create(teamMemberB2);
            const teamMemberB3: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user3._id!),
                    teamB
                );
            await teamMemberService.create(teamMemberB3);

            const teamC: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberC3: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user3._id!),
                    teamC
                );
            await teamMemberService.create(teamMemberC3);

            expect(
                await teamMemberService.getUsersInTeam(new ObjectID(teamA._id!))
            ).toHaveLength(2);
            expect(
                await teamMemberService.getUsersInTeam(new ObjectID(teamB._id!))
            ).toHaveLength(2);
            expect(
                await teamMemberService.getUsersInTeam(new ObjectID(teamC._id!))
            ).toHaveLength(1);
        });

        it('should return users in multiple teams', async () => {
            // team A members: user1 & user2
            // team B members: user2 & user3
            // team C members: user 3

            const user1: User =
                await UserServiceHelper.generateRandomUser().data.save();
            const user2: User =
                await UserServiceHelper.generateRandomUser().data.save();
            const user3: User =
                await UserServiceHelper.generateRandomUser().data.save();

            const teamA: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberA1: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user1._id!),
                    teamA
                );
            await teamMemberService.create(teamMemberA1);
            const teamMemberA2: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user2._id!),
                    teamA
                );
            await teamMemberService.create(teamMemberA2);

            const teamB: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberB2: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user2._id!),
                    teamB
                );
            await teamMemberService.create(teamMemberB2);
            const teamMemberB3: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user3._id!),
                    teamB
                );
            await teamMemberService.create(teamMemberB3);

            const teamC: Team = await TeamServiceHelper.generateRandomTeam(
                new ObjectID(project._id!),
                new ObjectID(user._id!)
            ).data.save();
            const teamMemberC3: CreateBy<TeamMember> =
                TeamMemberServiceHelper.generateRandomTeamMember(
                    new ObjectID(project._id!),
                    new ObjectID(user3._id!),
                    teamC
                );
            await teamMemberService.create(teamMemberC3);

            expect(
                await teamMemberService.getUsersInTeams([
                    new ObjectID(teamA._id!),
                    new ObjectID(teamB._id!),
                    new ObjectID(teamC._id!),
                ])
            ).toHaveLength(3);
        });
    });

    describe('updateSubscriptionSeatsByUniqueTeamMembersInProject', () => {
        const PROJECT_ID: string = 'projectId';
        const SUBSCRIPTION_ID: string = 'subscriptionId';

        it('should update subscription seats based on unique team members', async () => {
            jest.restoreAllMocks();

            process.env['SUBSCRIPTION_PLAN_1'] =
                'Free,monthly_plan_id,yearly_plan_id,0,0,1,7';
            process.env['SUBSCRIPTION_PLAN_2'] =
                'Growth,growth_monthly_plan_id,growth_yearly_plan_id,9,99,2,14';

            const NUM_MEMBERS: number = 5;
            jest.spyOn(
                teamMemberService,
                'getUniqueTeamMemberCountInProject'
            ).mockResolvedValue(NUM_MEMBERS);

            ProjectService.findOneById = jest.fn().mockResolvedValue({
                paymentProviderSubscriptionId: SUBSCRIPTION_ID,
                paymentProviderPlanId: 'monthly_plan_id',
                _id: PROJECT_ID,
            });

            await teamMemberService.updateSubscriptionSeatsByUniqueTeamMembersInProject(
                new ObjectID(PROJECT_ID)
            );

            expect(BillingService.changeQuantity).toHaveBeenCalledWith(
                SUBSCRIPTION_ID,
                NUM_MEMBERS
            );
            expect(ProjectService.updateOneById).toHaveBeenCalledWith({
                id: new ObjectID(PROJECT_ID),
                data: { paymentProviderSubscriptionSeats: NUM_MEMBERS },
                props: { isRoot: true },
            });
        });

        it('should not update subscription seats if there are no plans', async () => {
            process.env['SUBSCRIPTION_PLAN_1'] = undefined;
            process.env['SUBSCRIPTION_PLAN_2'] = undefined;

            const NUM_MEMBERS: number = 5;
            jest.spyOn(
                teamMemberService,
                'getUniqueTeamMemberCountInProject'
            ).mockResolvedValue(NUM_MEMBERS);

            ProjectService.findOneById = jest.fn().mockResolvedValue({
                paymentProviderSubscriptionId: SUBSCRIPTION_ID,
                paymentProviderPlanId: 'monthly_plan_id',
                _id: PROJECT_ID,
            });

            await teamMemberService.updateSubscriptionSeatsByUniqueTeamMembersInProject(
                new ObjectID(PROJECT_ID)
            );

            expect(BillingService.changeQuantity).not.toHaveBeenCalled();
            expect(ProjectService.updateOneById).not.toHaveBeenCalled();
        });
    });
});
